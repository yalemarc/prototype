//created by yale marc on 04/21/2017
/* eslint quotes: "off" , max-len: "off" , complexity: "off", angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */

import hasBledHtml from './has-bled-component.html';

let hasBledComponent = {
  template: hasBledHtml,
  controllerAs: 'hasBledCtrl',
  bindings: {
    cardData: '=',
    bledCount: '='
  },
  controller: function($scope, $rootScope, icgService) {
    $scope.cardData = this.cardData;
    $scope.bledTotal = this.bledCount;
    document.querySelectorAll('tspan')[4].childNodes[0].nodeValue = 'HAS-BLED score = ' + this.bledCount;

    console.log('BLED INIT TOTAL', $scope.bledTotal, this.bledCount)


    console.log('HAS BLED INIT', $scope.cardData, 'CALC ARRAY',$scope.bledCount, this.bledCount,'RISK', $scope.bledRisk)

    let bledLookup = [
      {value: 0, result:'1.13 bleeds per 100 patient-years'},
      {value: 1, result:'1.02 bleeds per 100 patient-years'},
      {value: 2, result:'1.88 bleeds per 100 patient-years'},
      {value: 3, result:'3.74 bleeds per 100 patient-years'},
      {value: 4, result:'8.70 bleeds per 100 patient-years'},
      {value: 5, result:' Insufficient data to estimate bleeding risk (of note, a score of 4 is associated with a bleeding risk of 8.70 bleeds per 100 patient-years)'}
    ]

    $scope.bledRisk = bledLookup[$scope.bledTotal - 1].result;

    $scope.$on('BLED_CALC_UPDATED', (evt,bledCt) => {
      console.log('BLED COUNT CHANGED', bledCt)
      $scope.bledTotal = bledCt;
      if (bledCt === 0) {
        $scope.bledRisk = bledLookup[bledCt].result;
        document.querySelectorAll('tspan')[4].childNodes[0].nodeValue = 'HAS-BLED score = ' + bledCt;
      } else {
        $scope.bledRisk = bledLookup[bledCt].result;
        document.querySelectorAll('tspan')[4].childNodes[0].nodeValue = 'HAS-BLED score = ' + bledCt;
      }
    });

    $scope.submitHasBled = function() {
      let goToRef = this.cardData.id + '-' + this.cardData.goTo;
      let selectedInfo = {selectedItem :{ id: goToRef}};
      console.log('SUBMIT CALC', icgService.getCalcData(), this.cardData, selectedInfo)
      $rootScope.$broadcast('OPTION_SELECTED',selectedInfo);
    }

  }
}

export default hasBledComponent;
