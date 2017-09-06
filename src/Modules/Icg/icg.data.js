// created by yale marc 12/19/2016

/* eslint quotes: "off" , max-len: "off", angular/log: "off", angular/deferred: "off" , angular/document-service: "off" */
console.log('LOAD DATA')
import {patientNumber,showEHR} from './icg.ehrdata'


function icgData($state, $sce, $http, $q, $rootScope) {

  let basicUrl = './src/mock_data/';
  let jsonName = '';
  let copyData = {};
  let icgSourceData = {};
  let icgSubData = {};
  let icgPatientData = {};
  let icgRefNum = '';
  // let patientNumber = '002';
  let subData = {
    add: false,
    rowNum: null,
    nodeId: null
  };


  document.body.addEventListener('click', function(evt) {
    $rootScope.$broadcast('CLOSE_USER_OPTIONS')
  });
  let addDataToChart = (node,data) => {
    let rowNum = 0;
    angular.forEach(icgSourceData.pathway, (row,$index) => {
      angular.forEach(row,(itemNode) => {
        if (itemNode.id === node) {
          rowNum = $index + 4;
        }
      })
    })
    if (addReplaceSubData(rowNum, node)) {
      icgSourceData.pathway.splice(rowNum,0,data);
      subData = {
        add: true,
        rowNum: rowNum,
        nodeId: node
      }
    }
  }

  let addReplaceSubData = (rowNum, nodeId) => {
    //check if any previous data added
    if (subData.add) {
      //check if same data
      if (subData.rowNum === rowNum && subData.nodeId === nodeId) {
        console.log('DATA ALREADY ADDED DO NOTHING')
        return false;
      } else {
        //remove old subData
        console.log('ELSE REMOVE', icgSourceData)
        icgSourceData.pathway.splice(subData.rowNum,1);
        return true;
      }
    }
    return true;
  }

  return {
    getIcgData: (name) => {
      return copyData;
    },
    resetIcgData: () => {
      // copyData = angular.copy(demoData);
    },
    isEHRSetup: () => {
      if (patientNumber) {
        return true
      }
      return false
    },
    getPathwaysData: (refNum) => {
      console.log('GET PATHWAYS DATA', refNum, patientNumber)
      if (refNum === '108277') {
        jsonName = 'low_back_pain';
      } else if (refNum === '107764') {
        jsonName = 'atrial_fibrillation'
      } else if (refNum === '108536') {
        jsonName = 'helicobacter_pylori'
      } else if (refNum === '109113') {
        jsonName = 'Hypertension'
      } else if (refNum === '108537') {
        console.log('LOAD DIABETES')
        jsonName = 'diabetes_108537'
      } else {
        jsonName = 'helicobacter_pylori-3';
      }
      console.log('PATHWAYS DATA', refNum, jsonName)
      icgRefNum = refNum;
      let defer = $q.defer();
      $http.get(basicUrl + jsonName + ".json")
        .then(function(response) {
          defer.resolve (response.data.pathway)
          icgSourceData = response.data;
          icgSubData = response.data.subLevels;
          console.log('SUB DATA', icgSubData)
          copyData = response.data;

        });

      return defer.promise;
    },
    loadPatientData: (patientID) => {
      console.log('LOAD PATIENT DATA',patientID)
      let defer = $q.defer();
      if (patientID.length > 0) {
        var url = basicUrl + "pd_" + patientID + ".json";
        console.log('PATIENT DATA URL', url)
        $http.get(url)
        .then(function(response) {
          defer.resolve (response.data.patientData)
          angular.forEach(response.data.patientData, function(item) {
            if (item.pathway === icgRefNum) {
              icgPatientData = item.pathwayData;
            }
          })
        }, function errorCallback(response) {
          //if no patient data found return empty object;
          icgPatientData = {};
          defer.resolve({"patientData":[ {} ]});
        });
      } else {
        icgPatientData = {};
        defer.resolve({"patientData":[ {} ]});
      }
      return defer.promise;

    },
    getPatientData: () => {
      return icgPatientData
    },

    getEHRStatus: () => {
      return showEHR
    },

    getPathwaysSubData: (node) => {
      let pathwaySubData = null;
      angular.forEach(icgSubData, (sData) => {
        if (sData.ref === node) {
          pathwaySubData = sData['sublevel-' + node];
        }
      })

      return pathwaySubData;
    },
    checkIfContinueNode: (nodeId)  => {
      let isContinue = false;
      angular.forEach(icgSourceData.pathway, (row,$index) => {
        angular.forEach(row,(itemNode) => {
          if (itemNode.id === nodeId) {
            if (itemNode.type === 'continue') {
              //If already active then do nothing
              if (itemNode.active) {
                isContinue = false;
              } else {
                itemNode.active = true
                isContinue = true;
              }

            }
          }
        });
      });
      return isContinue;
    }
  }

}

export default icgData;

