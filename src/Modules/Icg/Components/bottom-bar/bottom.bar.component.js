// created by yale marc 12/28/2016
import bottomBarHtml from './bottom-bar-component.html';

/* eslint quotes: "off" , max-len: "off", angular/log: "off",angular/document-service: "off" */

let bottomBarComponent = {
  template: bottomBarHtml,
  controllerAs: 'bottomBarCtrl',
  bindings: {
    showSummaryLinks: '='
  },
  controller: function ($scope,$window,algorService,$interval) {
    let policyActive = false;
    let policyEl = angular.element(document.querySelector('#icg-bottom-policy'));
    $scope.upToDatePolicy = `The Licensed Materials describe basic principles of diagnosis and therapy. The information provided in the Licensed Materials is no substitute for individual patient assessment based upon the healthcare provider's examination of each patient and consideration of laboratory data and other factors unique to the patient. The Licensed Materials should be used as a tool to help the user reach diagnostic and treatment decisions, bearing in mind that individual and unique circumstances may lead the user to reach decisions not presented in the Licensed Materials. The opinions expressed in the Licensed Materials are those of its authors and editors and may or may not represent the official position of any medical societies cooperating with, endorsing or recommending the Licensed Materials.`;
    // $scope.showPolicy = () => {
    //   //set width of policy to window width - right side panel width
    //   angular.element(document.getElementById('icg-bottom-policy')).css('width',_setPolicyWindowWidth());
    //   if (policyActive) {
    //     policyEl.removeClass('active');
    //     policyActive = false;
    //   } else {
    //     policyEl.addClass('active');
    //     policyActive = true;
    //   }
    // }

    // let _setPolicyWindowWidth = () => {
    //   let windowW = document.body.clientWidth || $window.innerWidth;
    //   let policyWidth = windowW - 385 + 'px';
    //   return policyWidth;
    // }

    // $scope.hideService = $interval(() => {
    //   console.log('HIDE SERVICE')
    //   algorService.hidePolicy();
    //   $interval.cancel($scope.hideService)
    // },8000);

    $scope.showPolicy = () => {
      algorService.showPolicy();
    }
  }
}

export default bottomBarComponent;
