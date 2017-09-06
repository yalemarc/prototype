// created by yale marc 12/16/2016

import authorsEditorsHtml from './authors-editors-component.html';

/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let authorsEditorsComponent = {
  template: authorsEditorsHtml,
  controllerAs: 'authorsEditorsCtrl',
  bindings: {
    authorsList: '='
  },
  controller: function($scope) {
    $scope.authorsList = this.authorsList;
  }
}

export default authorsEditorsComponent;
