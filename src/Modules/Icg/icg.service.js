/* eslint quotes: "off" , max-len: "off", angular/log: "off", angular/document-service: "off" */

function icgService($state,$sce,$interval) {

  const sumMed = [];
  const sumTreatment = [];
  const sidePanelDefaultWidth = '510';
  let windowSize = 'desktop';
  let calcData = {};
  let calcArray = [];
  const calcLookup = [
    { value: 1, result: "0.6%"},
    { value: 2, result: "2.2%"},
    { value: 3, result: "3.2%"},
    { value: 4, result: "4.8%"},
    { value: 5, result: "7.2%"},
    { value: 6, result: "9.7%"},
    { value: 7, result: "10.8%"},
    { value: 8, result: "11.2%"},
    { value: 9, result: "12.2%"}
  ];

  return {
    title: () => $state.current.name,

    addToSummaryMed: (name) => {
      sumMed.push(name);
    },

    getSummaryMed: (name) => {
      return sumMed;
    },

    addToSummaryTreatment: (name) => {
      sumTreatment.push(name);
    },

    getSummaryTreatment: (name) => {
      return sumTreatment;
    },

    setScrollTop: (distance) => {
      console.log('SET SCROLLTOP', distance)
      let startTop = document.getElementById("icg-side-panel").scrollTop;
      let amtMoved = 0;
      let amtMove = distance / 50;
      let scrollInterval = $interval(() => {
        amtMoved += amtMove;
        if (amtMoved > distance) {
          clearInterval(scrollInterval)
        } else {
          document.getElementById("icg-side-panel").scrollTop = startTop + amtMoved;
        }
      }, 10);
    },

    getSidePanelDefaultWidth: () => {
      return sidePanelDefaultWidth;
    },
    getWindowSize: () => {
      return windowSize
    },
    setWindowSize:(size) => {
      windowSize = size;
    },
    setCalcData:(data) => {
      calcData = data;
    },
    getCalcData: () => {
      return calcData;
    },
    addCalcArray: (data) => {
      angular.forEach(calcArray, (arrItem,$index) => {
        //if item already exists in array then remove previous version
        if (arrItem.quesSubject === data.quesSubject) {
          calcArray.splice($index,1);
        }
      });
      calcArray.push(data);
    },
    addCalcArrayMulti: (data) => {
      calcArray.push(data);
      console.log('ADD CALC ARRAY MULTI', calcArray, data)
    },
    removeCalcArrayMulti: (data) => {
      for (var i = calcArray.length - 1; i > -1; i--) {
        //If None of above seleccted remove all existing
        if (data.label === 'None of the above') {
          if (calcArray[i].quesSubject === "comorbidity") {
            calcArray.splice(i, 1);
          }
        } else if (calcArray[i].label === data.label) {
          calcArray.splice(i, 1);
        }
      }
    },
    getCalcArrayTotal: () => {
      let calcTotal = 0;
      let calcValue = '';
      angular.forEach(calcArray, (arrItem) => {
        calcTotal += arrItem.calcValue;
      })
      angular.forEach(calcLookup, (lookupItem) => {
        if (lookupItem.value === calcTotal) {
          calcValue = lookupItem.result;
        }
      })
      return {total: calcTotal, value: calcValue};
    },

    getCalcArray: () => {
      return calcArray
    }

  }

}

export default icgService;
