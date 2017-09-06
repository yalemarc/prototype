// created by yale marc 01042017

import popupModalHtml from './main-popup-modal.html'
/* eslint quotes: "off" , max-len: "off" , angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */

let mainPopupModalComponent = {
  template: popupModalHtml,
  controllerAs: 'popupModalCtrl',
  bindings:{
    icgData: '=',
    modalData: '='
  },
  controller: function ($scope,$rootScope,$interval, algorService) {
    // $scope.closemodal = this.closemodal;
    $scope.refData = this.icgData;
    $scope.showSummary = false;
    $scope.modalTitle = 'Relevant EHR Data'

    $scope.icgData = [ this.icgData[0] ];
    $scope.closeWindow = function() {
      $rootScope.$broadcast('CLOSE_MODAL')
    }

    $scope.onShowSummary = $rootScope.$on('SHOW_SUMMARY', () => {
      $scope.icgData = this.icgData;
      $scope.modalTitle = "Interactive Clinical Guideline Completed";
      $scope.showFrom = "Modal";
      $scope.showSummary = true;
      $scope.hideSummaryTitle = true;
      // console.log('MODAL SHOW SUMMARY', $scope.icgData, $scope.showFrom)
    })
    $scope.showHidePolicy = () => {
      // $scope.
    }
    $scope.showPolicy = true;
    $scope.upToDatePolicy = `The Licensed Materials describe basic principles of diagnosis and therapy. The information provided in the Licensed Materials is no substitute for individual patient assessment based upon the healthcare provider's examination of each patient and consideration of laboratory data and other factors unique to the patient. The Licensed Materials should be used as a tool to help the user reach diagnostic and treatment decisions, bearing in mind that individual and unique circumstances may lead the user to reach decisions not presented in the Licensed Materials. The opinions expressed in the Licensed Materials are those of its authors and editors and may or may not represent the official position of any medical societies cooperating with, endorsing or recommending the Licensed Materials.`;

    // // display policy for 5 seconds then fade out and remove
    let policyTimer = 0;
    $scope.policyDisplay = $interval(() => {
      policyTimer++;
      if (policyTimer === 5) {
        $scope.policyClass = 'hidden';
      }
      if (policyTimer === 6) {
        $scope.showPolicy = false;
        $scope.policyClass = '';
        $interval.cancel($scope.policyDisplay);
      }
    },1000)
  }
}

export default mainPopupModalComponent;
