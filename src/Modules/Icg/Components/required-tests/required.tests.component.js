// created by yale marc 06/12/2017
/* eslint quotes: "off" , max-len: "off", angular/log: "off" */
import requiredTestsHTML from './required-tests-component.html';

let requiredTestsComponent = {
  template: requiredTestsHTML,
  controllerAs: 'requiredTestsCtrl',
  bindings: {
    requiredContent: '=',
    requiredDisclaimer: '='
  },
  controller: function($scope,$sce) {
    let vm = this;
    $scope.requireList = ""
    $scope.showCarets = vm.requiredContent.length > 0 ? true : false;
    $scope.requiredCt = 0;

    let createList = () => {
      let listOpen = 'false';
      let listStart = '<div>';
      angular.forEach(vm.requiredContent, (item) => {
        if (item.type === 'statement') {
          if (listOpen) {
            listStart = '</ul><div>';
            listOpen = false;
          }
          $scope.requireList += listStart + item.label + '</div>';
        }
        if (item.type === 'list') {
          listStart = '<li>';
          if (!listOpen) {
            listStart = '<ul><li>';
            listOpen = true;
          }
          $scope.requireList += listStart + item.label + '</li>';
          $scope.requiredCt++
        }
      });
      $scope.requireList += listOpen ? '</ul>' : '';
    }
    createList();
    $scope.makeSafe = () => {
      let goodData = $sce.trustAsHtml($scope.requireList);
      return goodData;
    }
  }
}

export default requiredTestsComponent
