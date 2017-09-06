//created by yale marc 05/24/2017
import patientDataHtml from './patient-data-info-component.html'

/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let patientDataInfoComponent = {
  template: patientDataHtml,
  controllerAs: 'patientDataCtrl',
  bindings: {
    patientInfo: "=",
    refId: "="
  },
  controller: function($scope,$sce,$rootScope) {
    $scope.hideInfoData = true;
    let vm = this;
    let showRelevantData = $rootScope.$on('SHOW_REL_DATA', function(e, data) {
      if (vm.refId === data) {
        if ($scope.hideInfoData) {
          $scope.hideInfoData = false;
        } else {
          $scope.hideInfoData = true;
        }

      }
    })

    $scope.showInfo = () => {
      $scope.hideInfoData = false;
    }
    $scope.hideInfo = () => {
      $scope.hideInfoData = true;
    }

    $scope.makeSafe = (data) => {
      let goodData = $sce.trustAsHtml(data);
      return goodData;
    }
  }
}

export default patientDataInfoComponent;
