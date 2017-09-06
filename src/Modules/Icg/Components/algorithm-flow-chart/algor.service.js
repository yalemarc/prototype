// created by yale marc 12/29/2016
/* eslint quotes: "off" , max-len: "off" , angular/log: "off" , angular/document-service: "off", angular/angularelement: "off" */
import raphael from 'raphael';
import _ from 'lodash';

function algorService ($window,$interval,$timeout) {
  let vm = this;
  const diagramColors = {
    rectGreen: '#ABCC60',
    grey: '#D0D0D0',
    selectedBlue: '#2897D5',
    fillBlue: '#e3f4fc',
    fillWhite: '#FFFFFF',
    orange: '#EA8F00'
  };
  const diagramObj = {};
  const flowSubObj = {}
  const policyActive = false;
  let startupMode = true;
  let diagramSize = 300;
  let elements;
  let runDisplayTimer = () => {
    showDisclaimer()
    let policyTimer = 0
    let policyDisplay = $interval(() => {
      policyTimer++;
      if (policyTimer === 5) {
        hideDisclaimer();
        $interval.cancel(policyDisplay);
      }
    },1000)
  }
  let showDisclaimer = () => {
    //set width of policy to window width - right side panel width
    let policyEl = angular.element(document.querySelector('#icg-bottom-policy'));
    let windowW = document.body.clientWidth || $window.innerWidth;
    let sidePanelWidth = document.getElementById('icg-side-panel').style.width
    let policyWidth = windowW - Number(sidePanelWidth.substr(0,sidePanelWidth.length - 2)) + 'px';

    angular.element(document.getElementById('icg-bottom-policy')).css('width', policyWidth);
    if (this.policyActive) {
      policyEl.removeClass('active');
      this.policyActive = false;
    } else {
      policyEl.addClass('active');
      this.policyActive = true;
    }
  }

  let hideDisclaimer = () => {
    let policyEl = angular.element(document.querySelector('#icg-bottom-policy'));
    policyEl.removeClass('active');
    this.policyActive = false;
  }
  let getItemStartSpacing = (data,ref,id) => {
    let itemLength = 0;
    let pos = {
      start: -100,
      spacing: 0
    };
    angular.forEach(data, (item) => {
      if (item.ref === ref) {
        if (item.id === id) {
          pos.index = itemLength;
        }
        itemLength++;
      }
    })
    //determine spacing based on items in row
    switch (itemLength) {
      case 1:
        pos.spacing = 0;
        pos.start = -100;
        break;
      case 2:
        pos.spacing = 200;
        pos.start = -100;
        break;
      case 3:
        pos.spacing = 220;
        pos.start = -220;
        break;
      case 4:
        pos.spacing = 220;
        pos.start = -100;
        break;
      case 5:
        pos.spacing = 200;
        pos.start = -400;
        break;
    }

    return pos;
  }


// START OF RETURN SECTION
  return {

    getDiagramColors: () => {
      return diagramColors;
    },

    rectSelectedStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.fillBlue;
        document.getElementById(nodeId).style.stroke = diagramColors.selectedBlue;
      }
    },
    rectSelectedAgainStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.strokeWidth = 4
        document.getElementById(nodeId).style.stroke = '#176d9b';
      }
    },
    tabSelectedStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.selectedBlue;
        document.getElementById(nodeId).style.stroke = diagramColors.selectedBlue;
      }
    },
    rectInitialStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.fillWhite;
        document.getElementById(nodeId).style.stroke = diagramColors.rectGreen;
      }
    },
    rectActiveStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.fillWhite;
        document.getElementById(nodeId).style.stroke = diagramColors.orange;
      }
    },

    radioSelectedStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.selectedBlue;
        document.getElementById(nodeId).style.fillOpacity = '1';
        document.getElementById(nodeId).style.stroke = diagramColors.selectedBlue;
        document.getElementById(nodeId).style.opacity = 1;
      }
    },

    radioInitialStyle: (nodeId) => {
      if (document.getElementById(nodeId)) {
        document.getElementById(nodeId).style.fill = diagramColors.fillWhite;
        document.getElementById(nodeId).style.fillOpacity = '.6';
        document.getElementById(nodeId).style.stroke = diagramColors.grey;
        document.getElementById(nodeId).style.opacity = .6;
      }
    },

    lineSelectedStyle: (lineObj) => {
      lineObj.attr({
        'stroke-width': 2,
        'stroke': diagramColors.selectedBlue,
        'fill': diagramColors.selectedBlue
      })
    },

    lineInitialStyle: (lineObj) => {
      lineObj.attr({
        'stroke-width': 2,
        'stroke': diagramColors.grey,
        'fill': diagramColors.grey
      })
    },

    arrowLineSelectedStyle: (lineObj) => {
      lineObj.attr({
        'stroke-width': 2,
        'stroke': diagramColors.selectedBlue,
        'fill': diagramColors.selectedBlue,
        'arrow-end': 'block-wide-long'//,
        // 'opacity': 0
      })
      // elements[num].animate({opacity: 1}, 1000);
    },

    arrowLineInitialStyle: (lineObj) => {
      lineObj.attr({
        'stroke-width': 2,
        'stroke': diagramColors.grey,
        'fill': diagramColors.grey,
        'arrow-end': 'block-wide-long'//,
      })
    },

    rectAvailableStyle: (rectObj) => {
      rectObj.attr({
        'stroke': diagramColors.rectGreen,
        'fill': diagramColors.fillWhite
      })
    },

    radioAvailableStyle: (radioObj) => {
      radioObj.attr({

      })
    },

    getItemStartSpacing: (data,ref,id) => {
      return getItemStartSpacing(data,ref,id);


    },
    savePaper: (algor) => {
      this.diagramObj = algor;
    },

    removeAlgoritham1: () => {
      if (this.diagramObj) {
        this.diagramObj.remove();
      }
    },

    removeAllAlgorithams: () => {
      if (this.diagramObj) {
        this.diagramObj.remove();
      }
    },

    checkForWarning: (diagramData) => {
      let foundWarning = false;
      angular.forEach(diagramData, (rowItem) => {
        angular.forEach(rowItem, (item) => {
          angular.forEach(item.questions, (question) => {
            angular.forEach(question.options, (option) => {
              if (option.warning !== angular.isUndefined) {
                if (option.warning === option.value) {
                  foundWarning = true;
                }
              }
            })
          })
        })
      })
      return foundWarning;
    },

    setInfoCardCompleted: (cardNum) => {
      let patientInfoRef = '#patientInfo-' + cardNum + ' div.patient-data-info-box';
      angular.element(document.querySelector(patientInfoRef + ' div.pathways-caret-right-orange')).addClass('complete');
      angular.element(document.querySelector(patientInfoRef + ' div.pathways-caret-down-orange')).addClass('complete');
      angular.element(document.querySelector(patientInfoRef + ' div.patient-info-title')).addClass('complete');
      angular.element(document.querySelector(patientInfoRef)).addClass('complete');
      angular.element(document.querySelector('#card-content-' + cardNum)).addClass('complete');
    },

    displayDisclaimer: () => {
      runDisplayTimer();

    },
    // $scope.upToDatePolicy = `The Licensed Materials describe basic principles of diagnosis and therapy. The information provided in the Licensed Materials is no substitute for individual patient assessment based upon the healthcare provider's examination of each patient and consideration of laboratory data and other factors unique to the patient. The Licensed Materials should be used as a tool to help the user reach diagnostic and treatment decisions, bearing in mind that individual and unique circumstances may lead the user to reach decisions not presented in the Licensed Materials. The opinions expressed in the Licensed Materials are those of its authors and editors and may or may not represent the official position of any medical societies cooperating with, endorsing or recommending the Licensed Materials.`;
    showPolicy: () => {
      //set width of policy to window width - right side panel width
      let policyEl = angular.element(document.querySelector('#icg-bottom-policy'));
      document.getElementById('icg-bottom-policy').style.display = 'inline-block';
      console.log('SHOW POLICY')
      // document.getElementById('icg-bottom-policy').style.display = 'block !important';
      // let policyEl = document.getElementById('icg-bottom-policy');
      console.log('policy', policyEl, 'DOC BP', document.getElementById('icg-bottom-policy'))
      // policyEl.show()
      let windowW = document.body.clientWidth || $window.innerWidth;
      let sidePanelWidth = document.getElementById('icg-side-panel').style.width
      // let policyWidth = windowW - Number(sidePanelWidth.substr(0,sidePanelWidth.length - 2)) + 'px';
      let policyWidth = $window.innerWidth - 20 + 'px';

      angular.element(document.getElementById('icg-bottom-policy')).css('width', policyWidth);
      if (this.policyActive) {
        policyEl.removeClass('active');
        this.policyActive = false;
      } else {
        policyEl.addClass('active');
        this.policyActive = true;
      }
    },

    hidePolicy: () => {
      let policyEl = angular.element(document.querySelector('#icg-bottom-policy'));
      policyEl.removeClass('active');
      this.policyActive = false;
      $timeout(() => {
        document.getElementById('icg-bottom-policy').style.display = 'none';
      }, 1000)
    },

    setPolicyWindowWidth: () => {
      let windowW = document.body.clientWidth || $window.innerWidth;
      let policyWidth = windowW - 385 + 'px';
      return policyWidth;
    },

    zoomAlgor: (type) => {
      if (type === 'in') {
        diagramSize += 10;
      } else {
        diagramSize -= 10;
      }
      let diagramSizePercent = diagramSize + '%';
      this.diagramObj.setSize(diagramSizePercent, diagramSizePercent);
    },

    getZoomSize: () => {
      return diagramSize;
    },

    isStartup: () => {
      return startupMode;
    },

    setStarted: () => {
      startupMode = false;
    },
    setAsStartup: () => {
      startupMode = true;
    }

  }
}

export default algorService;
