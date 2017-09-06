import desktopHtml from './main-panel.html';
import angular from 'angular'

/* eslint quotes: "off" , max-len: "off", angular/log: "off", angular/document-service: "off" */

let mainPanelComponent = {
  template: desktopHtml,
  controllerAs: 'mainPanelCtrl',
  controller: function($rootScope,$interval,icgService,icgData, $document, $scope,$window,algorService,$element,$compile,$timeout) {
    let infoLinks = [];

    $scope.icgdata = icgData.getIcgData('demoData').pathway;
    $scope.mainTitle = icgData.getIcgData('demoData').mainTitle;
    $scope.showPopupModal = false;
    $scope.upToDatePolicy = `The Licensed Materials describe basic principles of diagnosis and therapy. The information provided in the Licensed Materials is no substitute for individual patient assessment based upon the healthcare provider's examination of each patient and consideration of laboratory data and other factors unique to the patient. The Licensed Materials should be used as a tool to help the user reach diagnostic and treatment decisions, bearing in mind that individual and unique circumstances may lead the user to reach decisions not presented in the Licensed Materials. The opinions expressed in the Licensed Materials are those of its authors and editors and may or may not represent the official position of any medical societies cooperating with, endorsing or recommending the Licensed Materials.`;
    $scope.showSideDisclaimer = true;
    $scope.slideoutOpen = false;
    $scope.showEHRData = false;
    $scope.patientEhrData = '';
    let positionResize = false;
    let ehrPreviousId = '';

    // window.onbeforeunload = function(){
    //   console.log('LEAVING PAGE TRIGGER')
    //   return 'Are you sure you want to leave?';
    // };
    // $window.onhashchange = function() {
    //   alert('MOVING TO NEW PAGE')
    // }
    // $window.onbeforeunload = function(e) {
    //   console.log('MESSAGE BEFORE UNLOAD')
    //    return 'Your dialog message';
    // };

    $scope.checkWarning = () => {
      $scope.showPopupModal = true;
      $scope.$apply();
    }

    $scope.closeModal = $rootScope.$on('CLOSE_MODAL', () => {
      console.log('CLOSE MODAL')
      $scope.showPopupModal = false;

    });

    $scope.optionSelected = $rootScope.$on('OPTION_SELECTED', () => {
      if ($scope.slideoutOpen) {
        $scope.closeSlideout();
      }
      $scope.showSideDisclaimer = false;
      if ($scope.showPopupModal) {
        $scope.showPopupModal = false;
      }
    });

    let ehrDataModal = $rootScope.$on('SHOW_EHR_DATA', (evt, data) => {
      console.log('SHOW HIDE EHR DATA', evt, data)
      // If same id ehr modal already displaying then hide else show
      let dataModal = document.getElementById('ehr-data-modal');
      if (angular.isObject(dataModal) && ehrPreviousId === data.id) {
        dataModal.style.display = 'none';
        $scope.showEHRModal = true;
        ehrPreviousId = '';
      } else {
        dataModal.style.display = 'block';
        dataModal.style.left = data.evt.clientX - 25 + 'px'
        dataModal.style.top = data.evt.clientY + 75 + 'px'
        document.getElementById('ehr-data-content').innerHTML = setupEHRData(data.data);
        $scope.showEHRModal = true;
        ehrPreviousId = data.id;
      }
    });

    let closeEHRModal = $rootScope.$on('CLOSE_EHR_MODAL', () => {
      document.getElementById('ehr-data-modal').style.display = 'none';
      ehrPreviousId = '';
    })


    let setupEHRData = (data) => {
      $scope.patientEhrData = '';
      angular.forEach(data, (item) => {
        $scope.patientEhrData += '<div class="pathways-ehr-data-label">' + item.label + '</div><ul class="pathways-ehr-list">';
        $scope.patientEhrData += '<li>' + item.desc + '</li></ul>';
      })
      return $scope.patientEhrData;
    }

    let setupMobile = () => {
      document.getElementById('icg-side-panel').style.width = '100%';
      document.getElementById('icg-side-panel-tab').style.display = 'none';
      document.getElementById('icg-side-panel').style.height = ($window.innerHeight - 105) + 'px';
      console.log('SET MOBILE HGT', document.getElementById('icg-side-panel').style.height)
      document.getElementById('pathways-slideout-panel').style.height = ($window.innerHeight - 180) + 'px';
      $scope.showMobile = true;
    }
    let setupDesktop = () => {
      $scope.showMobile = false;

      const hiddenMenu = document.getElementById('pathways-hidden-menu');
      if (hiddenMenu !== null) {
        hiddenMenu.style.display = 'none';
      }
      initialSetup();
    }
    let checkScreenSize = () => {
      if ($window.innerWidth < 861) {
        icgService.setWindowSize('mobile');
        setupMobile()
      }
      if ($window.innerWidth > 860) {
        icgService.setWindowSize('desktop');
        setupDesktop();
      }
    }

    let resizePanels = function () {
      const sidePanel = document.getElementById('icg-side-panel');
      const panelTab = document.getElementById('icg-side-panel-tab');
      const ehrMainPanel = document.getElementById('ehr-main-panel')
      panelTab.style.height = $window.innerHeight - 180 + 'px';
      if (icgService.getWindowSize() === 'desktop') {
        sidePanel.style.height = ($window.innerHeight - 152) + 'px';
        console.log('RESIZE HGT', sidePanel.style.height)
        if (icgData.getEHRStatus()) {
          ehrMainPanel.style.height = ($window.innerHeight - 103) + 'px'
          ehrMainPanel.style.width = ($window.innerWidth - 150) + 'px'
        }
      } else {
        sidePanel.style.height = $window.innerHeight - 100 + 'px';

      }
    }

    $window.onresize = () => {
      if ($window.innerWidth < 861) {
        $scope.showMobileBand = true;
        resizePanels();
        if (icgService.getWindowSize() === 'desktop') {
          icgService.setWindowSize('mobile');
          setupMobile()
        }
      }
      if ($window.innerWidth > 860) {
        $scope.showMobileBand = false;
        if (icgService.getWindowSize() === 'mobile') {
          icgService.setWindowSize('desktop');
          setupDesktop();
        } else {
          resizePanels();
        }
      }
    }
    $window.onresize();

    $scope.showHiddenMenu = () => {
      console.log('MAIN SHOW HIDDEN MENU')
    }

    let addInfo = $rootScope.$on('NODE_UPDATE', (evt, data) => {
      //Setup links for additional information slideouts
      angular.forEach(data.questions, (item) => {
        if (angular.isDefined(item.addInfoId)) {
          let noLink = true;
          angular.forEach(infoLinks, (infoLink) => {
            if (infoLink.id === item.addInfoId) {
              noLink = false;
            }
          });
          if (noLink && angular.isObject(document.getElementById(item.addInfoId))) {
            document.getElementById(item.addInfoId).addEventListener('click',() => {
              $scope.slideoutContents = item.addInfoContent;
              $scope.openSlideout();
            })
            infoLinks.push({id: item.addInfoId, content:item.addInfoContent})
          }
        }
      })

    })

    $scope.showSummary = $rootScope.$on('SHOW_SUMMARY', () => {
      // $scope.showPopupModal = true;
      $scope.showSummaryLinks = true;
    });

    $scope.openSlideout = (type) => {
      if (type !== 'warning')  {
        $scope.slideoutTitle = "Additional Information";
        document.getElementById('pathways-slideout-panel-header').className = '';
      }
      let slideout = document.getElementById('pathways-slideout-panel');
      let slideoutContent = document.getElementById('pathways-slideout-panel-content');
      let sidePanelWidth = document.getElementById('icg-side-panel').style.width;
      let slideoutWidth = $window.innerWidth - Number(sidePanelWidth.substr(0,sidePanelWidth.length - 2)) - 70;
      slideoutWidth = (slideoutWidth > 700) ? 700 : slideoutWidth;
      slideout.style.width = slideoutWidth + 'px';
      slideoutContent.style.width = slideoutWidth - 70 + 'px';
      let moveAmt = (Number(sidePanelWidth.substr(0,sidePanelWidth.length - 2)) + 270)  / 50;
      slideout.style.height = document.getElementById('icg-side-panel-tab').style.height
      if (icgData.getEHRStatus()) {
        slideoutContent.style.height = $window.innerHeight - 280 + 'px';
      } else {
        slideoutContent.style.height = $window.innerHeight - 230 + 'px';
        console.log('NO STATUS SHOW height', slideoutContent.style.height)
      }


      if (icgService.getWindowSize() === 'mobile') {
        slideout.style.width = $window.innerWidth - 50 + 'px';
        moveAmt = 5.8;
        slideout.style.zIndex = 9200;
      } else {
        slideout.style.zIndex = 9001;
      }
      let startRightNum = -300;
      let slideCt = 0;
      let showSlideout = $interval(() => {
        slideCt++;
        if (slideCt === 50) {
          $interval.cancel(showSlideout);
        }
        slideout.style.right = (startRightNum + (moveAmt * slideCt)) + 'px';
      }, 10)

      $scope.slideoutOpen = true;
    }

    $scope.closeSlideout = () => {
      let slideout = document.getElementById('pathways-slideout-panel');
      let slideoutCt = 0
      let startRight = slideout.style.right;
      let startRightNum = Number(startRight.substr(0,startRight.length - 2));
      let slideoutWidth = document.getElementById('pathways-slideout-panel').style.width
      slideoutWidth = Number(slideoutWidth.substr(0,slideoutWidth.length - 2));
      let moveAmt = (slideoutWidth + 300) / 50;
      if (icgService.getWindowSize() === 'mobile') {
        moveAmt = 10;
      }
      let hideSlideout = $interval(() =>{
        slideoutCt++;
        if (slideoutCt === 50) {
          $interval.cancel(hideSlideout);
          slideout.style.zIndex = 8900;
        }
        slideout.style.right = (startRightNum - (moveAmt * slideoutCt)) + 'px';
      }, 10)
      $scope.slideoutOpen = false;
      if (icgService.getWindowSize() !== 'mobile') {
        document.getElementById('icg-side-panel-tab').style.display = 'block';
      }
      if (document.getElementById('closeWarningsBtn') !== null) {
        document.getElementById('closeWarningsBtn').innerText = "Open Warnings and Exclusions";
      }
    }

    let initialSetup = function () {
      const sidePanel = document.getElementById('icg-side-panel');
      const panelTab = document.getElementById('icg-side-panel-tab');
      const ehrMainPanel = document.getElementById('ehr-main-panel')
      let panelWidth = icgService.getSidePanelDefaultWidth() + 'px';
      if (algorService.isStartup()) {
        //CODE TO RESIZE INITIAL PANEL WINDOW NO LONGER BEING USED
        // panelWidth = (($window.innerWidth / 2) > icgService.getSidePanelDefaultWidth()) ? ($window.innerWidth / 2) : icgService.getSidePanelDefaultWidth();
        // panelWidth = (panelWidth > 800) ? '800px' : panelWidth + 'px';
        // panelTab.style.display = 'none'
      } else {
        panelTab.style.display = 'inline';
      }
      sidePanel.style.width = panelWidth ;
      sidePanel.style.height = ($window.innerHeight - 167) + 'px';
      console.log('SET SPH', sidePanel.style.height)
      if (icgData.getEHRStatus()) {
        ehrMainPanel.style.height = ($window.innerHeight - 103) + 'px'
        ehrMainPanel.style.width = ($window.innerWidth - 150) + 'px'
      }
      sidePanel.style.top = '88px';
      let tabHeight = $window.innerHeight - 180 + 'px';
      panelTab.style.right = panelWidth;
      panelTab.style.top = "120px";
      panelTab.style.height = tabHeight;
      document.getElementById('pathways-slideout-panel').style.height = tabHeight
      document.getElementById('pathways-handle-stripes').style.backgroundSize = '10px ' + ($window.innerHeight - 200) + 'px';
      document.getElementById('pathways-handle-stripes').style.height = $window.innerHeight - 200 + 'px';
      $scope.slideoutOpen = false;
    };

    let checkPanelPosition = $rootScope.$on('REPOSITION_PANEL',() => {
      if ($scope.slideoutOpen) {
        $scope.closeSlideout();
      } //else {
        //$timeout(() => {
          // repositionSidePanel();
        //},200);
      //}
    });

    let repositionSidePanel = () => {
      const endWidth = icgService.getSidePanelDefaultWidth() + 'px';
      const panelTab = document.getElementById('icg-side-panel-tab');
      panelTab.style.display = 'inline'
      let startWidth = document.getElementById('icg-side-panel').style.width;
      startWidth = Number(startWidth.substr(0,startWidth.length - 2))
      const amtMove = (startWidth - Number(endWidth.substr(0,endWidth.length - 2))) / 50;
      let ctNum = 0;
      const slidePanel = $interval(() => {
        ctNum++;
        document.getElementById('icg-side-panel').style.width = startWidth - (amtMove * ctNum) + 'px';
        panelTab.style.right = startWidth - (amtMove * ctNum) + 'px';
        if (ctNum === 50) {
          $interval.cancel(slidePanel)
          algorService.setStarted();
        }
      },10)

    }

    $scope.hideDisclaimer = () => {
      algorService.hidePolicy();
    }

    checkScreenSize();
    // showDisclaimer();

    $scope.startResize = function () {
      document.addEventListener('mousemove', resizePanel);
    }

    $scope.stopResize = () => {
      document.removeEventListener('mousemove', resizePanel)
    }

    document.onmouseup = () => {
      document.removeEventListener('mousemove',resizePanel)
    }

    function resizePanel(evt) {
      let sideWidth = $window.innerWidth - evt.pageX - 5;
      let newRight = sideWidth + 'px';
      // limit minimum size of side panel
      if (sideWidth > 400) {
        document.getElementById('icg-side-panel-tab').style.right = newRight;
        // document.getElementById('icg-feedback-btn').style.right = newRight;
        document.getElementById('icg-side-panel').style.width = newRight;
      }
    }
    let requiredTestsOpen = false;

    let checkNew = $rootScope.$on('NEW_PATHWAY', () => {
      console.log('NEW PATHWAY')
      // initialSetup();
    })
  }
}

export default mainPanelComponent;
