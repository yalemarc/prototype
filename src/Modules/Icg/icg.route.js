/* eslint   angular/log: "off"  */

function exampleRoutes($stateProvider, $urlRouterProvider, $locationProvider) {


  $urlRouterProvider.when('', '/home');
  $urlRouterProvider.when('/', '/home');

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });

  $stateProvider
    .state('example', {
      url: '/example',
      component: 'example'
    })
    .state('dir', {
      url: '/example/dir',
      component: 'mainDir'
    })
    .state('dir.view', {
      url: '/view',
      templateUrl: './src/Components/example/sample-view.html'
    })
    .state('example.view', {
      url: '/view',
      templateUrl: './src/Components/examples/sample-view.html'
    })
    .state('home', {
      url: '/home',
      component: 'mainListScreen',
      resolve: {
        removeAlgor: (algorService,icgData) => {
          console.log('HOME SCREEN')
          algorService.removeAllAlgorithams();
          icgData.resetIcgData();
        }
      }
    })
    .state('ehr', {
      url: '/ehr',
      resolve: {
        removeAlgor: (algorService,icgData) => {
          console.log('EHR HOME')
          algorService.removeAllAlgorithams();
          icgData.resetIcgData();
        }
      }
    })
    .state('icg', {
      url: '/icg/:id',
      component: 'mainPanel',
      resolve: {
        getIcgData: (icgData,$stateParams,$window) => {
          return icgData.getPathwaysData($stateParams.id).then(function(data) {
            //check to see if patient id is being passed
            var location = $window.location.href;
            var vIndex = location.indexOf('?pi=');
            var sValue = '';
            if (vIndex > -1) {
              sValue = location.substr(vIndex + 4)
            }
            return sValue;
          })
        },
        getPatientData: (getIcgData, icgData) => {
          return icgData.loadPatientData(getIcgData).then(function(pd) {
            return true;
          })
        },
        dataReady: (getPatientData, icgData) => {
          console.log ('GET PATIENT DATA', getPatientData)
          return getPatientData;
        },
        setInitial: (dataReady, algorService) => {
          algorService.setAsStartup();
          return true;
        }
      }

    })
    .state('icg.icgid', {
      url: '/{id}',
      component: 'mainPanel'
    })

}

export default exampleRoutes;
