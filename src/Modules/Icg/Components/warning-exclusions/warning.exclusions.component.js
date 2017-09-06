// created by yale marc 03/03/2017
/* eslint angular/log: "off" */

import warningHtml from './warning-exclusions.html';

let warningExclusionsComponent = {
  template: warningHtml,
  controllerAs: 'warningCtrl',
  bindings: {
    warningContent: '=',
    exclusionsContent: '=',
    warnings: '='
  },
  controller: ($scope, $sce) => {
    console.log('INIT WARN EXC');
    $scope.makeSafe = (data) => {
      return $sce.trustAsHtml(data);
    }
  }


}

export default warningExclusionsComponent;
