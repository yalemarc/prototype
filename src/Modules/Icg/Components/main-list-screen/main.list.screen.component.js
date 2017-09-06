// created by yale marc 12302016

import mainListScreenHtml from './main-list-screen-component.html';

/* eslint quotes: "off" , max-len: "off", angular/log: "off",angular/document-service: "off" */

let mainListScreenComponent = {
  template: mainListScreenHtml,
  controllerAs: 'mainListScreenCtrl',
  bindings: {
    topTitle: '@'
  },
  controller: function($scope,$window) {
    let windowH = $window.innerHeight;
    console.log('size', windowH)
    var setHeight = windowH + 'px';
    document.getElementById('icg-home-page').style.height  = setHeight;
    $scope.showHidden = false;
  }
}

export default mainListScreenComponent;
