// created by yale marc 12/15/2016
import topbarHtml from './top-bar-component.html';

/* eslint quotes: "off" , max-len: "off", angular/log: "off", angular/document-service: "off", angular/window-service: "off" */
let topBarComponent = {
  template: topbarHtml,
  controllerAs:'topbarCtrl',
  bindings:{
    topTitle:'=',
    topLinks: '=',
    showTopLinks: '@',
    showMobile: '=',
    showMobileBand: '='
  },
  controller: function ($scope,$location,$interval,$http, $rootScope, algorService) {
    $scope.showTopLinks = this.showTopLinks
    $scope.topbarTitle = this.topTitle;
    $scope.showMobile = this.showMobile;
    $scope.displayUserOptions = false;
    let showOptionCount = 0;
    let optionDisplay = null;

    $scope.$watch('this.showMobileBand', () => {
      console.log('MOBILE CHANGED')
    },true);

    // CODE FOR SEARCH BUTTON
    var ckSearch = null;
    let searchEntry = document.getElementById('search-entry');
    let searchResults = document.getElementById('search-results');
    let searchBtn = document.getElementById('pathways-search-btn');

    searchEntry.addEventListener('keydown', function (evt) {
      $interval.cancel(ckSearch);
      ckSearch = $interval(() =>{
        console.log('CK SEARCH', searchEntry.value)
        getSearchTermResults();
        $interval.cancel(ckSearch);
      },500)
    })

    searchBtn.addEventListener('click', function (evt) {
      console.log('clicked to search', searchEntry.value)
      var url = "https://acdswww.utdlab.com/contents/search?USER_INPUT=&source=&searchControl=TOP_PULLDOWN&searchOffset=&respAppOnly=true&search=" + searchEntry.value
      window.open(url, '_blank')
    });

    let getSearchTermResults = () => {
      var url = "https://acdswww.utdlab.com/services/AutoComplete?prefix=" + searchEntry.value;
      $http.post(url)
        .then(function(response) {
          var resultList = '';
          angular.forEach(response.data.termList,(item,$index) => {
            let searchID = "search-" + $index;
            resultList += '<div class="search-option" id="' + searchID + '" >' + item.term + '</div>';
          })
          searchResults.addEventListener('click', function (evt) {
            console.log('CLICKED ON ITEM', evt, evt.path, evt.path[0].id)
            searchEntry.value = document.getElementById(evt.path[0].id).innerHTML;
            searchResults.style.display = 'none';
          })
          searchResults.style.display = 'inline-block';
          searchResults.innerHTML = resultList;
        });
    }

    // END CODE FOR SEARCH BUTTON

    $scope.showHidden = false;
    $scope.showPathways = () => {
      $location.path('/home');
    }
    $scope.showPolicy = () => {
      algorService.showPolicy();
    }
    $scope.showUserOptions = (e) => {
      $scope.displayUserOptions = true;
      optionDisplay = $interval(() =>{
        showOptionCount++;
        console.log('OPT CT', showOptionCount)
      },1000)
      console.log('display options')
    }
    $scope.hideUserOptions = () => {
      $scope.displayUserOptions = false;
    }
    $scope.goLink = (link) => {
      console.log('GO LINK', link)
      if (link === 'Other Pathways') {
        $location.path('/home');
      }
    }
    let closeOptions = $rootScope.$on('CLOSE_USER_OPTIONS', () => {
      console.log('HIDE OPTIONS', showOptionCount)
      if (showOptionCount > 1) {
        $interval.cancel(optionDisplay);
        showOptionCount = 0;
        $scope.displayUserOptions = false;
      }

    })

    console.log('TOP BAR SHOW MOBILE', this.showMobile, this.showHidden, this.showMobileBand)
    $scope.topLinks = ['Authors & Editors', 'Abbreviations', 'Related Content','Other Pathways']
  }
}

export default topBarComponent;

