// created by yale marc 06/07/2017

import ehrDataHtml from './ehr-data-modal.html';

let ehrDataModalComponent = {
  template: ehrDataHtml,
  controllerAs: 'ehrDataModalCtrl',
  bindings: {
    patientData: '='
  },
  controller: function ($scope,$sce,$rootScope) {
    $scope.makeSafe = (data) => {
      return $sce.trustAsHtml(data);
    }
    $scope.closeEhrModal = () => {
      $rootScope.$broadcast('CLOSE_EHR_MODAL')
    }

  }//end controller
}

export default ehrDataModalComponent
