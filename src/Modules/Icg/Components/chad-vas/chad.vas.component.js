//created by yale marc on 02/12/2017
/* eslint quotes: "off" , max-len: "off" , complexity: "off", angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */

import chadVasHtml from './chad-vas-component.html';

let chadVasComponent = {
  template: chadVasHtml,
  controllerAs: 'chadVasCtrl',
  bindings: {

  },
  controller: function($scope, $rootScope, icgService) {
    console.log('CHAD VAS INIT')
    $scope.bledList = [
      {name:'Hypertension (uncontrolled blood pressure)', value: 1, checked: false
      },{ name: 'Abnormal renal function',value: 1, checked: false
      },{ name:'Abnormal liver function', value: 1, checked: false
      },{ name:'Stroke history', value: 1, checked: false
      },{ name:'Bleeding tendency or predisposition', value: 1, checked: false
      },{ name:'Labile INRs (for patients taking warfarin)', value: 1, checked: false
      },{ name:'Elderly (age >65 years)', value: 1, checked: false
      },{ name:'Drugs (concomitant aspirin or nonsteroidal antiinflammatory drugs)', value: 1, checked: false
      },{ name:'Excess alcohol use', value: 1, checked: false
      },{ name:'None of the above', value: 0, checked: false}
    ];
    let bledLookup = [
      {value: 1, result:'1.02 bleeds per 100 patient-years'},
      {value: 2, result:'1.88 bleeds per 100 patient-years'},
      {value: 3, result:'3.74 bleeds per 100 patient-years'},
      {value: 4, result:'8.70 bleeds per 100 patient-years'},
      {value: 5, result:' Insufficient data to estimate bleeding risk (of note, a score of 4 is associated with a bleeding risk of 8.70 bleeds per 100 patient-years)'}
    ]
    $scope.bledTotal = 0;
    // $scope.chadScore = icgService.getCalcArrayTotal();

    $scope.onCalcResultsUpdate = $rootScope.$on('CALC_UPDATE', () => {
      setResults()
    });

    let setResults = () => {
      let calcResults  = icgService.getCalcArrayTotal();
      $scope.chadScore = calcResults.total;
      $scope.strokeRisk = calcResults.value;
      document.querySelectorAll('tspan')[2].childNodes[0].nodeValue = 'CHA2DS2-VASc score = ' + $scope.chadScore;
    }

    setResults();

    $scope.setSelected = (evt, val) => {
      console.log('SEL', evt, val)
      angular.forEach($scope.bledList, (bledItem) => {
        //Turn all off if select none
        if (evt.item.name === 'None of the above' && val) {
          if (bledItem.name === evt.item.name) {
            bledItem.checked = true;
            $scope.bledTotal = 0;
          } else {
            bledItem.checked = false;
          }
        } else if (bledItem.name === evt.item.name) {
          bledItem.checked = val;
          $scope.bledTotal ++;
        } else if (bledItem.name === 'None of the above') {
          bledItem.checked = false;
        }
      })
      console.log('BLED TOTAL', $scope.bledTotal)
      getBledResults();
    }

    let getBledResults = () => {
      let bledRef = ($scope.bledTotal < 5) ? $scope.bledTotal : 5;
      let bledResults = '';
      angular.forEach(bledLookup, (bledItem) => {
        if (bledItem.value === bledRef) {
          bledResults = bledItem.result
        }
      })

      $scope.bledRisk = bledResults
      console.log('STROKE RES', bledResults, $scope.bledRisk)
    }
  }
}

export default chadVasComponent;
