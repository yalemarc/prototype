// created by yale marc 03/03/2017
/* eslint angular/log: "off" , angular/document-service: "off", max-len: "off" */

import warningHtml from './exclusions-component.html';

let exclusionsComponent = {
  template: warningHtml,
  controllerAs: 'exclusionsCtrl',
  bindings: {
    exclusionsContent: '=',
    exclusionsList: '='
  },
  controller: function ($scope, $sce, $rootScope,icgData,$timeout,$document,algorService) {
    $scope.showExclusions = false;
    $scope.showExclusionsBtn = true;
    $scope.showCarets = this.exclusionsList ? true : false;

    $rootScope.$broadcast('HIDE_OPTIONS', icgData.getPatientData());
    var subExclusionsArray = [];
    let getExclusionCount = () => {
      let headerCt = 0
      angular.forEach(this.exclusionsList, (item) => {
        if (item.type === 'sub-header') {
          headerCt++
        }
      })
      return this.exclusionsList.length - headerCt;
    }
    $scope.exclusionCt = this.exclusionsList ? getExclusionCount() : 0;

    let updateList = () => {
      let setNoExclusions = true;
      angular.forEach(icgData.getPatientData(), (item) => {
        //check to see if ehr data for overview node
        if (item.node === '01') {
          setNoExclusions = false;
        }
        angular.forEach(item.exclusions, (exc) => {
          angular.forEach(this.exclusionsList, (excListItem) => {
            if (exc === excListItem.trigger) {
              excListItem.exclude = true;
              setNoExclusions = false;
            }
            // if (excListItem.type === 'sub-header') {
            //   console.log('FOUND SUB HEADER', excListItem.label)
            // }
          })
        })
      })
      // If there are no exclusions but there is ehr data than auto select yes
      if (setNoExclusions) {
        // Not currently auto-selecting yes as there may be unknown exclusions
        // document.getElementById('01-100').click();
        let selectedData = {selectedItem: { id: '01-100' }}
        // $rootScope.$broadcast('OPTION_SELECTED',selectedData);
        // document.getElementById('01-100-icon').style.display = 'inline-block';
      } else if (icgData.getPatientData().length !== angular.isundefined) {
        document.getElementById('01-0').click();
        document.getElementById('01-0-icon').style.display = 'inline-block';
        angular.element(document.querySelector('#card-content-01')).addClass('complete');
        let patientInfoRef = '#patientInfo-01 div.patient-data-info-box';
        angular.element(document.querySelector(patientInfoRef)).addClass('complete');
        angular.element(document.querySelector(patientInfoRef + ' div.pathways-caret-right-orange')).addClass('complete');
        angular.element(document.querySelector(patientInfoRef + ' div.pathways-caret-down-orange')).addClass('complete');
        angular.element(document.querySelector(patientInfoRef + ' div.patient-info-title')).addClass('complete');
        algorService.rectSelectedStyle('node-01-00');
        algorService.tabSelectedStyle('node-01-00-tab');
      }
    }
    $timeout(() => {
      updateList();
    },500)


    $scope.makeSafe = (data) => {
      return $sce.trustAsHtml(data);
    }
    $scope.showHideExclusions = () => {
      $scope.showExclusions = true;
      $scope.showExclusionsBtn = false;
      $rootScope.$broadcast('SHOW_EXCLUSIONS');
    }
    $scope.checkDataExclusion = (target) => {
      console.log('CHECK TARGET', target)
      return false;
    }
    $scope.isSubHeader = (item, index) => {
      if (item === 'sub-header') {
        var addToArray = true;
        angular.forEach(subExclusionsArray, function(excItem) {
          if (excItem.index === index) {
            addToArray = false
          }
        })
        if (addToArray) {
          subExclusionsArray.push({index: index, show: false});
        }
        return true;
      } else {
        return false;
      }
    }
    $scope.isSubItem = (item, index) => {
      if (item === 'sub-item') {
        var checkIndex = 0;
        angular.forEach(subExclusionsArray, function(arrItem) {
          if (arrItem.index < index) {
            checkIndex = arrItem.index;
          }
        })
        return $scope.showSubExclusions(checkIndex)
      } else {
        return false;
      }
    }
    $scope.isStandard = (item) => {
      if (item === 'label') {
        return true;
      } else {
        return false;
      }
    }
    $scope.showSubExclusions = (index) => {
      var showExc = false;
      angular.forEach(subExclusionsArray, function(arrItem) {
        if (arrItem.index === index && arrItem.show) {
          showExc = true
        }
      })

      return showExc;
    }
    $scope.chgSubExclusions = (index) => {
      angular.forEach(subExclusionsArray, function(arrItem) {
        if (arrItem.index === index) {
          arrItem.show = arrItem.show ? false : true;
        }
      })
    }
  }


}

export default exclusionsComponent;
