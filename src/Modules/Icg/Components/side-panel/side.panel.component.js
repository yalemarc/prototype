// created by yale marc 12/15/16

import panelHtml from './side-panel-component.html';
import angular from 'angular';
/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let sidePanelComponent = {
  template: panelHtml,
  controllerAs: 'panelCtrl',
  bindings: {
    otherdata :'@',
    icgData: '=',
    resizeStart: '&',
    resizeStop: '&',
    upToDateDisclaimer: '=',
    showSideDisclaimer: '=',
    topbarTitle: '='
  },
  controller: function($scope,$timeout,$interval,$rootScope,icgService,icgData) {
    $scope.topbarTitle = this.topbarTitle;
    $scope.showEHRInfo = icgData.getEHRStatus();

    $scope.$on('NODE_UPDATE', () => {
      $scope.showSummaryReport = false;
      // $scope.$apply();
    })
    $scope.$on('SHOW_SUMMARY', () => {
      $scope.showSummaryReport = true;
    })

    $scope.startResize = () => {
      this.resizeStart();
    }

    $scope.stopResize = () => {
      this.resizeStop();
    }


  }
}

export default sidePanelComponent;
