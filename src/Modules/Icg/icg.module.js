import angular from 'angular';
import routing from './icg.route';
import mainPanel from './Components/main-panel/main.panel.component';
import service from './icg.service';
import algor from './Components/algorithm-flow-chart/algor.component';
import ques from './Components/question-component/question.component';
import viewSettings from './Components/view-settings/view.settings.component';
import sidePanel from './Components/side-panel/side.panel.component';
import topBarComponent from './Components/top-bar/top.bar.component';
import infoCard from './Components/info-card/info.card.component';
import authorsEditors from './Components/authors-editors/authors.editors.component';
import cardOptions from './Components/card-options/card.options.component';
import summaryReport from './Components/summary-report/summary.report.component';
import icgData from './icg.data';
import leftSelectionPanel from './Components/left-selection-panel/left.selection.panel.component';
import bottomBar from './Components/bottom-bar/bottom.bar.component';
import algorService from './Components/algorithm-flow-chart/algor.service';
import mainListScreen from './Components/main-list-screen/main.list.screen.component';
import mainPopupModal from './Components/main-popup-modal/main.popup.modal.component';
import slideoutPanel from './Components/slideout-panel/slideout.panel.component';
import chadVasPanel from './Components/chad-vas/chad.vas.component';
import warningExclusionsPanel from './Components/warning-exclusions/warning.exclusions.component';
import warningComponent from './Components/warning-component/warning.component';
import exclusionsComponent from './Components/exclusions-component/exclusions.component';
import hasBledCalc from './Components/has-bled/has.bled.component';
import patientDataInfo from './Components/patient-data-info/patient.data.info.component';
import ehrData from './icg.ehrdata';
import ehrDataModalComponent from './Components/ehr-data-modal/ehr.data.modal.component';
import requiredTestsComponent from './Components/required-tests/required.tests.component';

angular
  .module('icg', [])
  .component('mainPanel', mainPanel)
  .factory('icgService', service)
  .config(routing)
  .component('algor', algor)
  .component('questionComponent', ques)
  .component('viewSettings', viewSettings)
  .component('sidePanel', sidePanel)
  .component('topBar', topBarComponent)
  .component('infoCard', infoCard)
  .component('authorsEditors', authorsEditors)
  .component('cardOptions', cardOptions)
  .component('summaryReport', summaryReport)
  .factory('icgData', icgData)
  .component('leftSelectionPanel', leftSelectionPanel)
  .component('bottomBar', bottomBar)
  .factory('algorService', algorService)
  .component('mainListScreen', mainListScreen)
  .component('mainPopupModal', mainPopupModal)
  .component('slideoutPanel', slideoutPanel)
  .component('chadVasPanel', chadVasPanel)
  .component('warningExclusionsPanel', warningExclusionsPanel)
  .component('warningComponent', warningComponent)
  .component('exclusionsComponent', exclusionsComponent)
  .component('hasBledCalc',hasBledCalc)
  .component('patientDataInfo', patientDataInfo)
  .component('ehrDataModal', ehrDataModalComponent)
  .component('requiredTests', requiredTestsComponent);
  // .config('noHash', icgNoHash);
