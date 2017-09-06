// created by yale marc 03/08/2017
/* eslint angular/log: "off" */

import warningHtml from './warning-component.html';

let warningComponent = {
  template: warningHtml,
  controllerAs: 'warningCtrl',
  bindings: {
    warningContent: '='
  },
  controller: ($scope, $sce) => {
    $scope.makeSafe = (data) => {
      return $sce.trustAsHtml(data);
    }
  }

}

export default warningComponent;
