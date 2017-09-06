// created by yale marc 12/19/2016

import summaryReportHtml from './summary-report-component.html';

/* eslint quotes: "off" , max-len: "off" , angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */
let summaryReportComponent = {
  template: summaryReportHtml,
  controllerAs: 'summaryReportCtrl',
  bindings: {
    icgData: '=',
    showFrom: '=',
    pathwayTitle: '='
  },
  controller: function($scope, icgService,$sce) {
    $scope.medications = icgService.getSummaryMed();
    $scope.pathwayTitle = this.pathwayTitle;
    $scope.showMedSummary = $scope.medications.length > 0 ? true : false;
    $scope.treatments = icgService.getSummaryTreatment();
    $scope.showTreatmentSummary = $scope.treatments.length > 0 ? true : false;
    $scope.summaryReportData = '';
    let summaryData = '';
    if (this.showFrom !== 'Modal') {
      $scope.showSummaryTitle = true;
    }

    $scope.calculateSummaryReport = () => {
      angular.forEach(this.icgData, (row) => {
        angular.forEach(row, (rowItem) => {
          angular.forEach(rowItem.questions, (question) => {
            angular.forEach(question.options, (selection) => {
              if (selection.value) {
                if (question.summaryDescription) {
                  summaryData += '<p> - ' + question.summaryDescription + ' ' + selection.label + '</p>';
                }
                if (question.summaryOverview) {
                  summaryData += '<p><i>' + question.summaryOverview + '</i></p>';
                }
              }
            })
          })
        })
      })
      return summaryData;
    }
    $scope.summaryReportData =  $sce.trustAsHtml($scope.calculateSummaryReport());
  }
}

export default summaryReportComponent;
