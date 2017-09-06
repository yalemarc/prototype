// created by yale marc 12/15/2016

import infoCardHtml from './info-card-component.html';
/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let infoCardComponent = {
  template: infoCardHtml,
  controllerAs: 'infoCardCrtl',
  bindings:{
    cardData: '=',
    levels: '=',
    icgData: '='
  },
  controller: function ($scope,$interval,$sce,$filter,$timeout,$rootScope,$compile,$element,icgData) {
    const vm = this;
    $scope.cardData = this.cardData;
    $scope.icgData = this.icgData;
    $scope.showWarning = false;
    $scope.openCloseSliderBtn = 'Close Warnings and Exclusions';
    $scope.showOptions = true;
    $scope.showChadVas = false;
    $scope.ehrRef = vm.cardData.ref + '-' + vm.cardData.id;
    $scope.showEhrPatientData = false;

    if (angular.isDefined(this.cardData.specialType)) {
      if (this.cardData.specialType === 'chadVas') {
        // $scope.showChadVas = true;
      }
    }
    $scope.makeSafe = (data) => {
      let goodData = $sce.trustAsHtml(data);
      return goodData;
    }
    $scope.openCloseSlider = function() {
      console.log('OPEN CLOSE SLIDER')
    }
    $scope.showExclusions = (exclusions) => {
      console.log('SHOW EXC', exclusions)
      return false;
    }
    let setPatientData = () => {
      $scope.patientInfo = '';
      angular.forEach(icgData.getPatientData(), function(item) {
        if (item.node === $scope.cardData.id) {
          $scope.showEhrPatientData = true;
          angular.forEach(item.relevantData, function (itemData) {
            $scope.patientInfo += '<div class="pathways-ehr-data-label">' + itemData.label + '</div><ul>';
            $scope.patientInfo += '<li>' + itemData.desc + '</li></ul>';
          })
        }
      })
    }
    setPatientData();

  }
}

export default infoCardComponent;
