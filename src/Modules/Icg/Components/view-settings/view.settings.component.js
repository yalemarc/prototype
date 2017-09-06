// created by yale marc 12/15/16
import settingsHtml from './view-settings-component.html';

/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let viewSettingsComponent = {
  template: settingsHtml,
  controllerAs: 'settingsCtrl',
  bindings:{

  },
  controller: ($scope,$window,algorService) => {
    $scope.resetAlgor = () => {
      $window.location.reload();
    }
    $scope.zoom = (type) => {
      algorService.zoomAlgor(type)
    }
  }
}

export default viewSettingsComponent;
