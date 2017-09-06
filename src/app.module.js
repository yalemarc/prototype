// import angular from 'angular';
import uirouter from 'angular-ui-router';
import icg from './Modules/Icg/icg.module';
import $ from 'jquery';
import jQuery from 'jquery';

require('./main.scss');

angular.module('app', [
  uirouter,
  'icg'
])
