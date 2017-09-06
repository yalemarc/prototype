// created by yale marc 01/23/2017
/* eslint angular/log: "off" */

import slideoutHtml from './slideout-panel.html';

let slideoutPanelComponent = {
  template: slideoutHtml,
  controllerAs: 'slideoutCtrl',
  bindings:{
    closeSlideout : '&',
    slideoutContents: '=',
    slideoutTitle: '=',
    slideoutWarning: '=',
    slideoutExclusions: '=',
    warnings: '='
  },
  controller: ($scope, $sce) => {
    $scope.headerTitle = 'Additional Information';
    $scope.makeSafe = (data) => {
      return $sce.trustAsHtml(data);
    }
  }

}

export default slideoutPanelComponent;
