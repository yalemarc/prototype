// created by yale marc 12/16/2016

import cardOptionsHtml from './card-options-component.html';

/* eslint quotes: "off" , max-len: "off" , complexity: "off", angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */

let cardOptionsComponent = {
  template: cardOptionsHtml,
  controllerAs: 'cardOptionsCtrl',
  bindings: {
    cardData: '=',
    questionItem: '=',
    showWarning: '='
  },
  controller: function($scope, $rootScope, icgService,$window,icgData) {
    $scope.cardData = this.cardData;
    // console.log('OPTION DISCLAIMER', $scope.cardData, )
    $scope.questionItem = this.questionItem;
    $scope.btnId = 'btn-' + this.cardData.id;
    $scope.showSummaryBtn = false;
    $scope.showSubmitOverview = false;
    // console.log('questionItem', this.questionItem, this.questionItem.options[0].id)

    let getDesc = (item) => {
      let sumDesc = (item.addSummary.value !== '') ? item.addSummary.value : item.label;
      return sumDesc;
    }

    let checkEHRData = () => {
      angular.forEach(icgData.getPatientData(), (dataNode) => {
        angular.forEach(this.questionItem.options, (item) => {
          if (item.value) {
            if (item.id.split('-')[0] === dataNode.node) {
              let itemRef = item.id + '-icon';
              document.getElementById(itemRef).style.display = "inline-block"
            }
          }
        })
      })
    }

    $scope.setSelected = (evt, value) => {
      let setBroadcast = {};
      let recalcBled = false;
      // checkEHRData();
      angular.forEach(this.questionItem.options, (item) => {
        if ($scope.questionItem.optionType === 'single') {
          if (item.id === evt.item.id) {
            item.value = value;
            //if item is selected
            if (value) {
              // sconsole.log('selected ITEM', this.cardData, this.questionItem, 'ITEM', item)
              if (item.addSummary) {
                if (item.addSummary.type === 'medication') {
                  icgService.addToSummaryMed(getDesc(item));
                }
                if (item.addSummary.type === 'treatment') {
                  icgService.addToSummaryTreatment(getDesc(item));
                }
              }
              let refId = item.id.split('-')[1];

              if (refId === 'question'  || refId === 'calculator') {
                //INITIALY JUST MADE NEXT QUESTION ACTIVE
                //NEW LOOKS IN ARRAY AND MAKES ALL ACTIVE
                let questionsToActivate = item.id.split('-')[2].split(',');
                angular.forEach(questionsToActivate, (questNum) => {
                  if (angular.isDefined(this.cardData.questions[questNum])) {
                    this.cardData.questions[questNum].active = true;
                  }
                });

                let windowH = Number($window.innerHeight) - 180;
                icgService.setScrollTop(windowH);
                if (refId === 'calculator') {
                  //If initial question then save data for redirect after calc
                  if (Number(item.id.split('-')[2]) === 1) {
                    let calcData = {
                      selectedItem: item,
                      response: item.label
                    }
                    //add back in ref to next node
                    calcData.selectedItem.id = '01-100-1';
                    icgService.setCalcData(calcData);

                  } else {
                    icgService.addCalcArray(item);
                  }
                  $rootScope.$broadcast('CALC_UPDATE');
                }
              } else {
                if ($scope.checkWarning(item)) {
                  setBroadcast.selectedItem = item;
                  setBroadcast.response = item.label;
                }
              }
            }
          } else {
            if (item.value) {
              setBroadcast.previous = true;
            }
            item.value = false;
          }
        }

        if ($scope.questionItem.optionType === 'multiple') {
          //If None of above deselect all
          if (evt.item.label === 'None of the above' && value) {
            if (item.id === evt.item.id) {
              icgService.removeCalcArrayMulti(item);
              item.checked = true;
            } else {
              item.checked = false;
            }
          } else if (item.label === 'None of the above') {
            item.checked = false;
          } else if (item.id === evt.item.id) {
            item.checked = value;
            if (value) {
              icgService.addCalcArrayMulti(item);
            } else {
              icgService.removeCalcArrayMulti(item);
            }
          }
          $rootScope.$broadcast('CALC_UPDATE');
          if (this.questionItem.options[0].id.substr(0,2) === '02') {
            $scope.showHasBledScore = true;
            recalcBled = true;
          }
          if (this.questionItem.options[0].id.substr(0,2) === '01') {
            $scope.showSubmitOverview = true;
            $scope.showCalcNextBtn = true;
          }
        }

      });

      if (setBroadcast.selectedItem) {
        if (setBroadcast.selectedItem.id.split('-')[1] === 'summary') {
          $scope.showSummaryBtn = true;
          $scope.showSummaryObj = setBroadcast;
        } else {
          console.log('OPTION SELECTED', setBroadcast)
          $rootScope.$broadcast('OPTION_SELECTED',setBroadcast);
        }
      }
      if (recalcBled) {
        hasBledCalc();
      }
    }

    let hasBledCalc = function() {
      let selectArray = icgService.getCalcArray();
      $scope.bledCount = 0
      angular.forEach(selectArray,(selectItem) => {
        if (selectItem.id.substr(0,2) === '02') {
          $scope.bledCount ++;
        }
      })
      $rootScope.$broadcast('BLED_CALC_UPDATED',$scope.bledCount);
    }

    $scope.showSummary = () => {
      $rootScope.$broadcast('OPTION_SELECTED',$scope.showSummaryObj);
      console.log('SHOW SUMMARY', $scope.showSummaryObj)
      $scope.showSummaryBtn = false;
    }

    $scope.checkWarning = (item) => {
      if (item.warning) {
        if (item.warning === item.value) {
          this.showWarning = true;
          return false;
        }
      }
      this.showWarning = false;
      return true;
    }

    $scope.submitOverviewCalc = function() {
      let goToRef = this.cardData.id + '-' + this.cardData.goTo;
      let selectedInfo = {selectedItem :{ id: goToRef}};
      $rootScope.$broadcast('OPTION_SELECTED',selectedInfo);
      $scope.showCalcNextBtn = false;
      document.getElementById('node-50-01').style.stroke = "rgb(40, 151, 213)";
      document.getElementById('node-50-01').style.fill = "rgb(227, 244, 252)";
      document.getElementById('node-75-50').style.stroke = "rgb(234, 143, 0)";
      document.getElementById('card-content-50').style.border = "#0064a0 2px solid";
      document.getElementById('card-content-50').style.backgroundColor = "rgb(227, 244, 252)";

    }

    $scope.showEHRData = (ref) => {
      $rootScope.$broadcast('SHOW_REL_DATA', ref.split('-')[0])
    }
  }
}

export default cardOptionsComponent;
