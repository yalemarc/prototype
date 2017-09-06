import algorHtml from './algor.html';
import raphael from 'raphael';
// import $ from 'jquery';
import _ from 'lodash';

/* eslint quotes: "off" , max-len: "off" , max-statements: "off", angular/log: "off" , angular/document-service: "off", angular/angularelement: "off", complexity: "off", angular/definedundefined: "off" */
let exampleComponent = {
  template: algorHtml,
  controllerAs: 'example',
  bindings: {
    icgdata: '=',
    ckWarning: '&'
  },
  controller: function(icgService,icgData,$window,$rootScope,$scope,$interval,$timeout,algorService,$q) {
    const vm = this;
    vm.title = icgService.title();
    let centerX = 950;
    let initialY = 220;
    let chartTracker = {};
    let icgDiagramData = icgData.getIcgData().pathway;
    let verticalLines = [];
    let diagramSubset = {};
    let subDiagrams = [];


    const diagramColors = {
      rectGreen: '#ABCC60',
      grey: '#D0D0D0',
      selectedBlue: '#2897D5',
      fillBlue: '#e3f4fc',
      fillWhite: '#FFFFFF',
      orange: '#EA8F00',
      veryLtGray: '#f2f2f2'
    };
    const chartObjs = [];

    let paper = raphael(0,0,4000,4000);

    let currentDiagram = paper;
    let currentDiagramData = [];
    algorService.savePaper(paper);
    paper.canvas.setAttribute('id','pathFlow1');
    paper.canvas.style.backgroundColor = diagramColors.veryLtGray;

    let elements = [];
    let clickedNode = false;

//NEW FOR EMR
    const tabObjs = [];
    let createRectTab = () => {
      return paper.rect(32,-12,30,16,6);
    }
    let createTab = (borderColor,nodeId) => {
      let rectTab = createRectTab();
      rectTab.attr({
        'fill':diagramColors[borderColor],
        'stroke': diagramColors[borderColor],
        'stroke-width': 2,
        'cursor': 'pointer'
      }).node.id = nodeId + '-tab';
      tabObjs.push({id:nodeId + '-tab',obj: rectTab});
      return rectTab
    }
    let createTabLabel = (refText,x,y) => {
      let textObj = paper.text(x, y ,refText)
        .attr({
          'fill':'white',
          'cursor': 'pointer',
          'font-size': '9px',
          'line-height': '9px',
          'font-family': 'Arial',
        });
      return textObj;
    }
    let setTabSelected = (refId) => {
      angular.forEach(tabObjs, (item) => {
        if (item.id.split('-')[1] === refId) {
          item.obj.attr({
            'fill': diagramColors.selectedBlue,
            'stroke': diagramColors.selectedBlue
          });
        }
      });
    }
    let setTabActive = (refId) => {
      angular.forEach(tabObjs, (item) => {
        if (item.id.split('-')[1] === refId) {
          item.obj.attr({
            'fill': diagramColors.orange,
            'stroke': diagramColors.orange
          });
        }
      });
    }
    let setTabInactive = (refId) => {
      angular.forEach(tabObjs, (item) => {
        if (item.id.split('-')[1] === refId) {
          item.obj.attr({
            'fill': diagramColors.rectGreen,
            'stroke': diagramColors.rectGreen
          });
        }
      });
    }

    //Function to check if there is data available for node
    let dataAvailable = (nodeId) => {
      let ehrNode = false;
      angular.forEach(icgData.getPatientData(), (item) => {
        if (nodeId !== undefined && nodeId.split('-')[1] === item.node) {
          ehrNode = true;
        }
      });
      return ehrNode;
    }

    let showTabEHRdata = (evt,nodeId) => {
      angular.forEach(icgData.getPatientData(),function(item) {
        if (item.node === nodeId.split('-')[1]) {
          let nodeData = {data: item.relevantData, id:nodeId, evt:evt}
          $rootScope.$broadcast('SHOW_EHR_DATA', nodeData)
        }

      })
    }
    //END NEW FOR EMR

    let createNewBox = function(boxText,x,y,nodeId,rectType,borderColor,nodeType) {
      let textObj1, boxTab, tabLabel;

      // New EHR Tabs if data available
      if (dataAvailable(nodeId)) {
        boxTab = createTab(borderColor,nodeId);
        boxTab.click(function(evt) {
          showTabEHRdata(evt,nodeId);
        })
        tabLabel = createTabLabel('EHR',46,-6,nodeId);
        tabLabel.click(function(evt) {
          showTabEHRdata(evt,nodeId);
        })
      }

      let standRect = rectType === 'std' ? createStandRect(0) : createStandRect(rectType.split('-')[1]);
      standRect.attr({
        'fill':diagramColors.fillWhite,
        'stroke': diagramColors[borderColor],
        'stroke-width': 2,
        'cursor': 'pointer'
      }).node.id = nodeId;
      let boxRect = paper.set();
      boxRect.push(standRect);

      // New EHR Tabs is data available and created above
      if (dataAvailable(nodeId)) {
        boxRect.push(boxTab);
        boxRect.push(tabLabel);
      }

      let textArray = calcLineBreakChr(boxText);
      if (textArray.length === 1) {
        textObj1 = createTextObj(textArray[0],90,20);
        boxRect.push(textObj1);
      } else {
        textObj1 = createTextObj(textArray[0],90,13);
        let textObj2 = createTextObj(textArray[1],90,27);
        textObj2.click(function(evt) {
          setSelectedClearOthers(nodeId,evt);
          clickedNode = true;
        });
        boxRect.push(textObj1);
        boxRect.push(textObj2);
      }

      textObj1.click(function(evt) {
        setSelectedClearOthers(nodeId,evt);
        clickedNode = true;
      });

      standRect.click(function(evt) {
        setSelectedClearOthers(nodeId,evt);
        clickedNode = true;
      })
      let caret = null;
      if (nodeType === 'continue') {
        let d = ['M',80,38,'L',90,50,'L',100,38];
        caret = paper.path(d);
        caret.attr({
          'stroke': diagramColors[borderColor],
          'stroke-width': 2,
          'fill':diagramColors.fillWhite
        })
        boxRect.push(caret)
        //ADD CARET TO BOTTOM
      }

      boxRect.translate(x,y);
      chartObjs.push({ id: nodeId, obj: standRect, caret: caret});
    }

    let activeNode = (nodeID) => {
      angular.forEach(currentDiagramData, function(item, index) {
        angular.forEach(item, (itemNode, itemIndex) => {
          var nodeRef = 'node-' + itemNode.id + '-' + itemNode.ref;
          if (nodeRef === nodeID) {
            // do not active continue nodes
            if (itemNode.type !== 'continue') {
              itemNode.active = true;
              $rootScope.$broadcast('NODE_UPDATE',itemNode)
            }
          }
        });
      });
    }

    let createRadioObj = function(radioText,x,y,nodeId) {
      let radioObj = paper.circle(x,y,7)
        .attr({
          'stroke-width': 2,
          'stroke': diagramColors.grey,
          'fill': diagramColors.fillWhite,
          'cursor': 'pointer',
          'opacity': .6
        })
      radioObj.node.id = nodeId;
      radioObj.toFront();

      elements.push({'ref':nodeId.split('-')[3], 'id': nodeId.split('-')[2], 'type': 'radio',  'obj': radioObj});
      radioObj.click(function(evt) {
        setSelectedClearOthers(nodeId.substr(3,nodeId.length),evt);
        clickedNode = true;
      })
      createTextObj(radioText,x,y - 14);
    }

    let highlightLines = (idNum, refNum) => {
      angular.forEach(elements, function(item,$index) {
        if (item.id === idNum && item.ref === refNum) {
          if (item.type === 'arrow') {
            algorService.arrowLineSelectedStyle(item.obj);
          } else {
            algorService.lineSelectedStyle(item.obj);
            item.obj.toFront()
          }
        } else {
          if (item.type === 'vert') {
            if (item.id.substr(0,1) === idNum.substr(0,1) && item.ref === refNum) {
              algorService.lineSelectedStyle(item.obj);
            }
          }
        }
      })
    }

    let unHighlightLines = (idNum, refNum) => {
      angular.forEach(elements, function(item) {
        if (item.id === idNum) {
          if (item.type === 'arrow') {
            algorService.arrowLineInitialStyle(item.obj);
          } else {
            algorService.lineInitialStyle(item.obj);
          }
        } //do not need to unhightlight vertical as shared with other selections  else {
        //   if (item.type === 'vert') {
        //     if (item.id.substr(0,1) === idNum.substr(0,1) && item.ref === refNum) {
        //       lineInitialStyle(item.obj);
        //     }
        //   }
        // }
      })
    }

    let createNewLine = function(startX, startY, endX, endY, lineType,colorType, nodeItem) {
      var pathTxt = 'M' + startX + " " + startY + "L" + endX + " " + endY;
      var line = paper.path(pathTxt)
        .attr({
          'stroke-width': 2,
          'stroke': diagramColors[colorType],
          'fill': diagramColors[colorType]
        });

      if (lineType === 'arrow') {line.attr({'arrow-end': 'block-wide-long'})}
      if (nodeItem) {
        line.node.id = lineType + '-' + nodeItem.ref + nodeItem.id;
        elements.push({'ref':nodeItem.ref, 'id': nodeItem.id, 'type': lineType,  'obj': line});
      }
    }

    let createCircleArrowObj = (refText,x,y,color) => {
      let circleObj = paper.circle(x,y,15)
        .attr({
          'stroke': diagramColors[color],
          'fill': diagramColors.fillWhite,
          'stroke-width': 2
        })
      createNewLine(x - 5,y - 5,x,y + 3,'std', 'rectGreen')
      createNewLine(x + 5,y - 5,x,y + 3,'std', 'rectGreen')
      let textArray = calcLineBreakChr(refText)
      if (textArray.length === 1) {
        createTextObj(textArray[0],x  + (textArray[0].length * 2.2) + 35,y)
      } else {
        if (textArray.length === 2) {
          createTextObj(textArray[0],x + (textArray[0].length * 2.2) + 35,y - 6);
          createTextObj(textArray[1],x + (textArray[1].length * 2.2) + 35 - 10,y + 6);
        }
      }
    }

    let createTextObj = (refText,x,y) => {
      let textObj = paper.text(x, y ,refText)
        .attr({
          'fill':'black',
          'cursor': 'pointer',
          'font-size': '10px',
          'line-height': '12px',
          'font-family': 'Arial',
        });
      return textObj;
    }

    let calcLineBreak = (refText) => {
      let textArray = refText.split(' ')
      let lineArray = [];
      let lineText = '';
      angular.forEach(textArray, function(item,index) {
        if (lineText.length > 0) {
          let checkText = lineText + ' ' + item;
          if (checkText.length > 25 && index !== textArray.length - 1) {
            lineArray.push(lineText);
            lineText = item;
          } else {
            lineText = checkText;
          }
        } else {
          lineText = item;
        }
        if (index === textArray.length - 1) { lineArray.push(lineText)}
      });
      return lineArray;
    }

    let calcLineBreakChr = (refText) => {
      let lineArray = [];
      let ckText = refText;
      let brkPosition = 0;
      while (brkPosition > -1) {
        brkPosition = ckText.indexOf('~');
        if (brkPosition !== -1) {
          lineArray.push(ckText.substr(0,brkPosition))
          ckText = ckText.substr(brkPosition + 1)
        }
      }
      lineArray.push(ckText);
      return lineArray;
    }


    let createStandRect = (widthExtra) => {
      let widthE = 140 + Number(widthExtra);
      let startX = (-Number(widthExtra) / 2) + 20;
      return paper.rect(startX,0,widthE,40,6);
    }

    let createRoundRect = () => {
      return paper.rect(0,0,180,40,6);
    }

    let ckSubDiagrams = (id) => {
      let addNewSub = true
      angular.forEach(subDiagrams, (item) => {
        if (item.nodeId === id) {
          addNewSub = false;
          if (item.status === 'current') {
            console.log('ALREADY SHOWN DO NOTHING')
          } else {
            console.log('ALREADY CREATED FADE BACK IN')
            item.status = 'current';
            fadeSubset(item.nodeSet, 'in');
          }
        } else {
          if (item.status === 'current') {
            item.status = '';
            fadeSubset(item.nodeSet, 'out');
          }
        }
      });
      return addNewSub;
    }

    let addSubDataToInitialData = (newData, flowId) => {
      // add newData  to initial Diagram Data
      //find row where continue item exists and add data after
      let addRowIndex = 0;
      angular.forEach(icgDiagramData, (row, rowIndex) => {
        angular.forEach(row, (itemNode) => {
          if (itemNode.id === flowId) {
            addRowIndex = rowIndex
          }
        })
      })
      currentDiagramData  = icgDiagramData;
      //ADD EACH NEW ROW INDIVIDUALLY
      addRowIndex++
      angular.forEach(newData, (newRow) => {
        currentDiagramData.splice(addRowIndex,0,newRow);
        addRowIndex++
      });
      $scope.$apply()
    }

    let createFlowchart = function(flowData,flowType,flowId) {
      console.log('IS PATIENT NUMBER',icgData.isEHRSetup())
      // If EHR Setup lower algorithm top by 100px
      if (icgData.isEHRSetup()) {
        initialY += 70;
        centerX += 50;
      }
      //set if this is an initial setup
      if (flowType === 'initial') {
        currentDiagramData = flowData;
        setInitialChartItems();
        verticalLines = [];
      } else {
        //trigger a new set so all sub elements go into single set when setFinish called
        //check to see if subflow previously created and if so just reshow
        // if previous not current then hide
        addSubDataToInitialData(flowData, flowId)
        if (!ckSubDiagrams(flowId)) {
          console.log ('QUIT FLOW')
          return;
        }
        diagramSubset = null;
        paper.setStart()
      }

      angular.forEach(flowData, function(item, index) {
        angular.forEach(item, (itemNode, itemIndex) => {
          let nodeName = 'node-' + itemNode.id + '-' + itemNode.ref;
          let pos = algorService.getItemStartSpacing(item,itemNode.ref,itemNode.id);
          let widthType = itemNode.extraWide ? 'EW-' + itemNode.extraWide : 'std';

          // intial item unique
          if (flowType === 'initial' && (index === 0 || index === 1)) {
            if (index === 1) {
              createNewBox(itemNode.statement, centerX - 90, initialY + 100,nodeName, widthType, 'rectGreen');
              chartTracker[itemNode.id] = {
                id: itemNode.id,
                y: initialY + 100,
                x: centerX,
                end: false,
                level: index,
                type: itemNode.type
              }
            }
          } else {
            if (itemNode.type !== 'summary') {
              // let pos = algorService.getItemStartSpacing(item,itemNode.ref,itemNode.id);
              //create vertical line and track that created
              if (flowType === 'initial') {
                if (_.indexOf(verticalLines,itemNode.ref) === -1) {
                  let ctRef = Number(itemNode.ref);
                  createNewLine(chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 40, chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 100,'vert','grey', itemNode);
                  verticalLines.push(itemNode.ref);
                }
              } else {
                if (isRefTypeContinue(itemNode.ref)) {
                  // start vertical line below caret
                  createNewLine(chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 50, chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 100,'vert','grey', itemNode);
                  verticalLines.push(itemNode.ref);
                } else {
                  createNewLine(chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 40, chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 100,'vert','grey', itemNode);
                  verticalLines.push(itemNode.ref);
                }

              }
              //ALLOW FOR SPECIAL WIDTH SPACING
              let widthSpacing = pos.spacing;
              let widthStart = pos.start;
              if (itemNode.specialWidth !== undefined) {
                widthSpacing = widthSpacing * itemNode.specialWidth;
                widthStart = widthStart * itemNode.specialWidth;
              }
              //IF SUBLEVEL THEN ONLY SINGLE VERTICAL LINE (ABOVE)
              if (itemNode.type !== 'subLevel' && itemNode.type !== 'single') {
                // add horz line
                createNewLine(chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index), chartTracker[itemNode.ref].y + 100, chartTracker[itemNode.ref].x, chartTracker[itemNode.ref].y + 100, 'horz','grey', itemNode);
                //add down arrows
                createNewLine(chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index), chartTracker[itemNode.ref].y + 106, chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index), chartTracker[itemNode.ref].y + 150, 'arrow','grey', itemNode);
                 // add radio buttons
                createRadioObj(itemNode.response,chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index),chartTracker[itemNode.ref].y + 100,'rb-' + nodeName);
                //add line items
              }

              if (itemNode.type === 'single') {
                //add down arrows
                createNewLine(chartTracker[itemNode.ref].x , chartTracker[itemNode.ref].y + 40 , chartTracker[itemNode.ref].x  , chartTracker[itemNode.ref].y + 100 , 'arrow','grey', itemNode);

                createNewBox(itemNode.statement, chartTracker[itemNode.ref].x + widthStart  + 10, chartTracker[itemNode.ref].y + 100, nodeName, widthType, 'rectGreen');

                chartTracker[itemNode.id] = {
                  id: itemNode.id,
                  y: chartTracker[itemNode.ref].y + 100,
                  x: chartTracker[itemNode.ref].x ,
                  end: false,
                  level: index,
                  type: itemNode.type
                }
              }

              if (itemNode.type === 'end') {
                createNewBox(itemNode.statement, chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index) - 90, chartTracker[itemNode.ref].y + 150, nodeName, widthType, 'rectGreen');
              }
              if (itemNode.type === 'question') {
                createNewBox(itemNode.statement, chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index) - 90, chartTracker[itemNode.ref].y + 150, nodeName, widthType, 'rectGreen');
                chartTracker[itemNode.id] = {
                  id: itemNode.id,
                  y: chartTracker[itemNode.ref].y + 150,
                  x: chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index),
                  end: false,
                  level: index,
                  type: itemNode.type
                }
              }
              if (itemNode.type === 'continue') {
                createNewBox(itemNode.statement, chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index) - 90, chartTracker[itemNode.ref].y + 150, nodeName, widthType, 'rectGreen','continue');
                chartTracker[itemNode.id] = {
                  id: itemNode.id,
                  y: chartTracker[itemNode.ref].y + 150,
                  x: chartTracker[itemNode.ref].x + widthStart + (widthSpacing * pos.index),
                  end: false,
                  level: index,
                  type: itemNode.type

                }
              }
              if (itemNode.type === 'subLevel') {
                createNewBox(itemNode.statement, chartTracker[itemNode.ref].x - 90, chartTracker[itemNode.ref].y + 100, nodeName, widthType, 'rectGreen');
                chartTracker[itemNode.id] = {
                  id: itemNode.id,
                  y: chartTracker[itemNode.ref].y + 100,
                  x: chartTracker[itemNode.ref].x ,
                  end: false,
                  level: index,
                  type: itemNode.type
                }
              }
              //Make nodes preset to active (first sub level nodes) to active
              if (itemNode.active) {
                activeNode(itemNode.id)
                algorService.rectActiveStyle('node-' + itemNode.id + '-' + itemNode.ref)
                setTabActive(itemNode.id.split('-')[1])
              }
            }
          }
        })
      })

      if (flowType === 'sub') {
        diagramSubset = paper.setFinish();
        diagramSubset.attr({opacity: 0});
        subDiagrams.push({
          nodeId: flowId,
          nodeSet: diagramSubset,
          status: 'current'
        })
        fadeSubset(diagramSubset,'in');
      }
    }

    const isRefTypeContinue = (ref) => {
      let isContinue = false;
      angular.forEach(chartTracker, (node) => {
        if (node.id === ref) {
          if (node.type === 'continue') {
            isContinue = true;
          }
        }
      })
      return isContinue;
    }

    let fadeSubset = function(flowSet,direction) {
      let subOpacity = direction === 'in' ? 0 : 1;
      flowSet.show();
      let fade = $interval(() => {
        subOpacity = direction === 'in' ? subOpacity += .10 : subOpacity -= .10;
        if (subOpacity >= 1 || subOpacity <= 0) {
          $interval.cancel(fade)
          if (direction === 'out') {
            flowSet.hide();
          }
        } else {
          flowSet.attr({opacity: subOpacity})
        }
      }, 50)
    }

    let setSelectedOption = $rootScope.$on('OPTION_SELECTED', (e, selectedData) => {
      if (selectedData) {
        let selectedItem = selectedData.selectedItem;
        clickedNode = false;
        if (selectedData.previous) {
          clearData(selectedData);
        }
        let refId = selectedItem.id.split('-')[1];
        if (algorService.isStartup() && icgService.getWindowSize() === 'desktop') {
          $rootScope.$broadcast('REPOSITION_PANEL')
          $timeout(() => {
            setSelectionOptions(selectedItem, refId);
          },700)
        } else {
          setSelectionOptions(selectedItem, refId);
        }
      }
    })

    const setSelectionOptions = (selectedItem, refId) => {
      angular.forEach(currentDiagramData, function(item, index) {
        angular.forEach(item, (itemNode, itemIndex) => {
          if (itemNode.id === refId) {
            if (refId === 'summary') {
              $rootScope.$broadcast('SHOW_SUMMARY');
              algorService.rectSelectedStyle(selectedItem.refNode);
              algorService.setInfoCardCompleted(selectedItem.id.split('-')[0]);
              $timeout(function() {
                let calcTopDistance = document.getElementById("summary-report").offsetHeight;
                // setScrollTop(calcTopDistance);
                setScrollToLast()
              });
            } else {
              let setupData = false;
              if (!itemNode.active) {
                setupData = true;
              }
              itemNode.active = true;
              //change node status to active
              itemNode.status = "active";
              $timeout(function() {
                // reformat nodeId in correct order
                let nodeId = 'node-' + selectedItem.id.split('-')[1] + '-' + selectedItem.id.split('-')[0] ;
                setSelectedItems(nodeId)
                setHighlightedItem(nodeId)
                setSelectedClearOthers('node-' + selectedItem.id.split('-')[1] + '-' + selectedItem.id.split('-')[0]);
                if (setupData) {
                  setOptionsFromData(itemNode.id)
                }
              })
            }
          }
        })
      })
    }

    let setOptionsFromData = (nodeId) => {
      console.log('SET OPTIONS FROM DATA', nodeId)
      angular.forEach(icgData.getPatientData(), (item) => {
        if (nodeId !== undefined && nodeId === item.node) {
          angular.forEach(item.questions, (ques) => {
            angular.forEach(ques.id, (quesId) => {
              console.log('SET ITEM FROM CLICK', nodeId,quesId, item)
              document.getElementById(quesId).click();
              document.getElementById(quesId + '-icon').style.display = 'inline-block'
            })
          })
        }
      });
    }

    let clearData = (selectedData) => {
      let selectedId = selectedData.selectedItem.id.split('-')[0];
      let selectedMatch = false;
      _.eachRight(currentDiagramData, (row) => {
        angular.forEach(row, (nodeItem) => {
          if (nodeItem.id === selectedId) {
            selectedMatch = true;
          } else {
            if (nodeItem.ref === selectedId && !selectedMatch) {
              if (nodeItem.response !== selectedData.response) {
                nodeItem.active = false;
                clearOptions(nodeItem.questions);
              }
            } else {
              if (!selectedMatch) {
                nodeItem.active = false;
                clearOptions(nodeItem.questions);
              }
            }
          }
        });
      });
    }

    let clearOptions = (nodeQuestions) => {
      angular.forEach(nodeQuestions, (question) => {
        angular.forEach(question.options, (option) => {
          if (!_.isUndefined(option.value)) {
            option.value = false;
          }
        });
      });
    }

    let calcScrollTops = (scrollIds) => {
      let scrollDistance = 0;
      let totalHeight = 0
      let lastHeight = 0
      $timeout(function() {
        angular.forEach(scrollIds, (refId, $index) => {
          //skip first item which is last info card as want to go to top of this
          if ($index > 0) {
            totalHeight += document.getElementById("card-" + refId).offsetHeight
          }
        });
        //scroll distance is distance from current scrollTop to new scrollTop
        scrollDistance = totalHeight - document.getElementById("icg-side-panel").scrollTop;
        setScrollTop(scrollDistance);
      });
    }
    let unboldAllSelectedNodes = () => {
      _.eachRight(currentDiagramData, (row) => {
        angular.forEach(row, (itemNode, itemIndex) => {
          if (itemNode.status === 'complete') {
            let refID = itemNode.ref === '0' ? '00' : itemNode.ref;
            let chgNode = 'node-' + itemNode.id + '-' + refID;
            let chgCard = 'card-content-' + itemNode.id;
            document.getElementById(chgNode).style.strokeWidth = 2;
            document.getElementById(chgCard).style.border = '2px solid rgb(40,151,213)'
            let infoBox = '#' + chgCard + ' div.patient-data-info-box';
          }
        });
      });
    }

    let updateCurrentData = (selectedId,updateFlow) => {
      if (updateFlow) {
        createFlowchart(icgData.getPathwaysSubData(selectedId) ,'sub',selectedId);
      }
      let refNode;
      let questRef = '0-0';
      let initialItem = true;
      $scope.scrollIDs = [];
      let itemPreviousSelected = false;
      let doNothing = false;
      let initialResponse = null;
      let isContinue = false
      _.eachRight(currentDiagramData, (row) => {
        angular.forEach(row, (itemNode, itemIndex) => {
          itemPreviousSelected = false;
          if (itemNode.id === selectedId) {
            if (initialItem) {
              isContinue =  itemNode.type === 'continue' ? true : isContinue;
              // check to see if clicked on CONTINUE NODE
              if (isContinue) {
                refNode = 'node-' + selectedId + '-' + itemNode.ref;
                //Mark node as selected
                algorService.rectSelectedStyle(refNode);
                setSelectedItems(refNode);
                // if this is the actual continue node do one create flowchart
                //add sublevel items to flow chart
                if (itemNode.type === 'continue') {
                  let clickNode = 'node-' + itemNode.subId + '-' + selectedId;
                  setSelectedClearOthers(clickNode)
                  itemPreviousSelected = true;

                  //Change style of sublevel node. Quick fix needs to be updated to use more standard procedures.
                  document.getElementById('card-content-' + selectedId).style.display = 'none';
                  document.getElementById('card-' + selectedId).style.display = 'none';

                }
              } else {
                // set selected node to active as long as not continue node
                itemNode.status = 'active';
                itemPreviousSelected = itemNode.questions[0] ? checkOptionSelected(itemNode.questions[0].options) : false;
                initialResponse = itemNode.response;
              }

            }
            if (itemPreviousSelected) {
              doNothing = true;
            } else {
              //check questions for refNode
              refNode = 'node-' + selectedId + '-' + itemNode.ref;
              checkQuestionsAutoSelect(itemNode, questRef)
              questRef = itemNode.ref + '-' + selectedId;
              activeNode(refNode);
              setSelectedItems(refNode);

              //if initial item then set to orange active else set to selected
              if (initialItem && !isContinue) {
                algorService.rectActiveStyle(refNode);
                setTabActive(selectedId)
                initialItem = false;
              } else {
                algorService.rectSelectedStyle(refNode);
                setTabSelected(selectedId)
                itemNode.status = 'complete';
                algorService.setInfoCardCompleted(refNode.split('-')[1])
              }

              highlightLines(refNode.split('-')[1],refNode.split('-')[2]);
              algorService.radioSelectedStyle('rb-' + refNode);
              $scope.scrollIDs.push(selectedId);
              selectedId = itemNode.ref;
            }

          } else {
            if (!doNothing) {
              if (!itemNode.active ||  initialItem || initialResponse) {
                refNode = 'node-' + itemNode.id + '-' + itemNode.ref;
                algorService.rectInitialStyle(refNode);
                setTabInactive(itemNode.id);
                setCaretInitialStyle(refNode);
                itemNode.status = "off";
                unHighlightLines(refNode.split('-')[1],refNode.split('-')[2]);
                algorService.radioInitialStyle('rb-' + refNode);
                itemNode.active = false;
              }
            }
          }
        });
      });
    }
    // let boldSelectedNode = (selectedItem) => {
    //   unboldAllSelectedNodes();
    //   algorService.rectSelectedAgainStyle(selectedItem)
    //   let infoID = 'card-content-' + selectedItem.split('-')[1];
    //   document.getElementById(infoID).style.border = '4px solid #176d9b';
    // }

    let setSelectedClearOthers = (selectedItem, evt) => {
      // Go through list from bottom level to top level
      // if item selected then highlight, set active, and set to find all related above and highlight
      // if item not selected and no lower item selected then set inactive;
      // if (algorService.checkForWarning(icgDiagramData)) {
      //   this.ckWarning();
      let selectedId = selectedItem.split('-')[1];
      repositionChart(selectedItem,evt);
      // Show Overview modal if Overview 01 selected
      if (selectedId === '01') {
        $rootScope.$broadcast('SHOW_OVERVIEW');
      }
      if (findIfPreviousSelected(selectedId)) {
        // boldSelectedNode(selectedItem)
        setScrollToSelected(selectedId)
      } else {

        let questRef = '0-0';
        let initialItem = true;
        $scope.scrollIDs = [];
        let itemPreviousSelected = false;
        let doNothing = false;
        let initialResponse = null;

        updateCurrentData(selectedId, icgData.checkIfContinueNode(selectedId));

        calcScrollTops($scope.scrollIDs);
        algorService.rectSelectedStyle('node-01-00');
        algorService.radioSelectedStyle('rb-node-01-00');
        highlightLines('01','00');
      }

      let selectedObj = {
        selectedItem: {
          id:selectedId
        }
      };
      console.log('SET SELECT CLEAR OTHER',selectedId.substr(5), 'ID', selectedId, 'OBJ',selectedObj)
      setOptionsFromData(selectedId);
      $rootScope.$broadcast('OPTION_SELECTED', selectedObj);
    }
    let setScrollToSelected = (selectedId) => {
      let newTop = 0;
      let notItem = true;
      _.eachRight($scope.scrollIDs, (item) => {
        if (notItem) {
          if (item !== selectedId) {
            newTop += document.getElementById("card-" + item).offsetHeight;
          } else {
            notItem = false;
          }
        }
      });
      let currentTop = document.getElementById("icg-side-panel").scrollTop;
      let setTop = newTop - currentTop;
      setScrollTop(setTop);
    }

    let setScrollToLast = () => {
      let newTop = 0;
      angular.forEach($scope.scrollIDs,(item) => {
        newTop += document.getElementById("card-" + item).offsetHeight;
      })
      let currentTop = document.getElementById("icg-side-panel").scrollTop;
      let setTop = newTop - currentTop;
      setScrollTop(setTop);
    }

    let findIfPreviousSelected = (selectedId) => {
      let previousSelect = false;
      angular.forEach(currentDiagramData, (row) => {
        angular.forEach(row, (itemNode) => {
          if (itemNode.id === selectedId) {
            // do not perform check if type is continue node
            if (itemNode.type === 'continue') {
              return false;
            } else {
              if (itemNode.questions[0] && checkOptionSelected(itemNode.questions[0].options)) {
                previousSelect = true;
              }
            }

          }
        });
      });
      return previousSelect;
    }

    let checkOptionSelected = (options) => {
      let optionSelected = false;
      angular.forEach(options, (item) => {
        if (item.value) {
          optionSelected = true
        }
      })
      return optionSelected;
    }

    let checkEarlierNodeSelected = (selectedId) => {
      let earlierSelected = 0;
      angular.forEach(currentDiagramData, function(row) {
        angular.forEach(row,function(itemNode) {
          if (itemNode.id !== selectedId && itemNode.active) {
            earlierSelected++;
          }
        })
      })
      return earlierSelected;
    }

    let checkQuestionsAutoSelect = (itemNode, refNode) => {
      //make sure questions exist as do not exist on continue nodes
      if (itemNode.questions[0]) {
        angular.forEach(itemNode.questions[0].options, (item) => {
          if (item.id === refNode) {
            item.value = true;
          } else {
            item.value = false;
          }
        });
      }
    }

    let setSelectedItems = (id) => {
      let refId = id.split('-')[2];
      angular.forEach(chartObjs, (item) => {

        if (item.id.split('-')[1] === refId) {
          item.obj.attr({
            'fill': diagramColors.fillBlue,
            'stroke': diagramColors.selectedBlue,
            'strokeWidth': 2
          })

          if (item.caret !== null) {
            item.caret.attr({
              'fill': diagramColors.fillBlue,
              'stroke': diagramColors.selectedBlue,
              'stroke-width': 2
            })
            item.caret.toFront();
          }
          setTabSelected(refId)
        }
      });
    }

    const setCaretInitialStyle = (ref) => {
      let refId = ref.split('-')[1];
      angular.forEach(chartObjs, (item) => {
        if (item.id.split('-')[1] === refId) {
          if (item.caret !== null) {
            item.caret.attr({
              'fill': diagramColors.fillWhite,
              'stroke': diagramColors.rectGreen
            })
            item.caret.toFront();
          }
        }
      })
    }
    let setHighlightedItem = (id) => {
      // highlight selected box
      // rectSelectedStyle(nodeId);
      angular.forEach(chartObjs, (item) => {
        if (item.id === id) {
          item.obj.attr({
            'stroke': diagramColors.orange,
          });
          // setTabActive(id.split('-')[1])
        }
      });
      highlightLines(id.split('-')[1],id.split('-')[2]);
      algorService.radioSelectedStyle('rb-' + id);
    }

    let setScrollTop = (distance) => {
      let startTop = document.getElementById("icg-side-panel").scrollTop;
      let amtMoved = 0;
      let amtMove = distance / 50;
      let scrollInterval = $interval(() => {
        amtMoved += amtMove;
        if (ckMove()) {
          $interval.cancel(scrollInterval);
        } else {
          document.getElementById("icg-side-panel").scrollTop = startTop + amtMoved;
        }
      }, 10);
      let ckMove = () => {
        if (distance > 0) {
          if (amtMoved >= distance) {
            return true;
          } else {
            return false;
          }
        } else {
          if (amtMoved <= distance) {
            return true;
          } else {
            return false;
          }
        }
      }
    }

    let setInitialChartItems = () => {
      var nodeTitle = icgData.getIcgData().pathway[0][0].statement;
      var nodeXtraWidth = icgData.getIcgData().pathway[0][0].extraWide
      createNewBox(nodeTitle, centerX - 90, initialY,'node-01-00', 'overview-' + nodeXtraWidth, 'orange');
      // algorService.rectSelectedStyle('node-01-00');
      createNewLine(centerX, initialY + 40, centerX, initialY + 100,'arrow','grey',{ref:'00',id:'01'});
      createRadioObj('',centerX,initialY + 65,'rb-node-01-00');
      // algorService.radioSelectedStyle('rb-node-01-00');
    }
    createFlowchart(icgDiagramData, 'initial');
    let origDiaPos = {}
    let setInitialAlgorPosition = (function () {
      let panelWidth = icgService.getSidePanelDefaultWidth() + 'px';
      panelWidth = panelWidth.substr(0,panelWidth.length - 2);
      let windowW = document.body.clientWidth || $window.innerWidth;
      let algorWidth = windowW - panelWidth;
      let algorX = centerX - (algorWidth / 2);
      algorX = 1100 + (algorWidth - 400);
      algorX = 2100;
      let windowH = Math.max(document.body.clientHeight ,$window.innerHeight);
      let setHeight = icgData.getPatientData().length > 0 ? (windowH - 144) + 'px' : (windowH - 152) + 'px';
      var modalHeight = (windowH - 150) + 'px';
      document.getElementById('icg-side-panel').style.height  = setHeight;
      document.getElementById('icg-main-popup-modal').style.height  = modalHeight;
      paper.setViewBox(0 ,100,2000,2000,true);
      paper.setSize('300%', '300%');
      document.getElementById('pathFlow1').style.left = -(algorWidth + 700) + 'px';
      origDiaPos.x = -(algorWidth + 700);
      let diaTop = document.getElementById('pathFlow1').style.top;
      origDiaPos.y = Number(diaTop.substr(0,diaTop.length - 2));
      // let alertText = String(document.getElementById('pathFlow1').style.left) + '-' + String(diaTop) + '-'+origDiaPos.y+'-'+origDiaPos.x
      // alert( alertText)
    }());

    // code to move diagram
    let moveDiagram = false;
    let algoDiagram1 = document.getElementById('pathFlow1');


    algoDiagram1.onmousedown = function(evt) {
      let dX = algoDiagram1.style.left;
      let diagramX = Number(dX.substr(0,dX.length - 2));
      let dY = algoDiagram1.style.top;
      let diagramY = Number(dY.substr(0,dY.length - 2));
      moveDiagram = true;
      $scope.moveMouse = algoDiagram1.addEventListener('mousemove', function(e) {
        if (moveDiagram) {
          algoDiagram1.style.left = (diagramX - (evt.pageX - e.pageX)) + 'px';
          algoDiagram1.style.top = diagramY - (evt.pageY - e.pageY) + 'px';
        }
      })
    }
    algoDiagram1.onmouseup = function(evt) {
      moveDiagram = false;
    }

    let repositionChart = (selectedItem,evt) => {
      console.log('reposition', evt, selectedItem)
      // Only reposition if selecting from algo
      if (evt !== undefined) {
        let prevPos =  findNodePosition(selectedItem.split('-')[1]);
        let algoLeft = algoDiagram1.style.left;
        let algoTop = algoDiagram1.style.top;
        let algoX = algoLeft.substr(0,algoLeft.length - 2);
        let algoY = algoTop.substr(0,algoTop.length - 2);
        //Allow for calculation based on diagram being resized
        let zoomRatio = algorService.getZoomSize() / 300;
        let goToPos = {x: evt.pageX + 200, y: evt.pageY - 200};
        let calcX = ($window.innerWidth - icgService.getSidePanelDefaultWidth()) / 2;
        let amtMove = {x: ((evt.pageX - calcX) * zoomRatio), y: (goToPos.y * zoomRatio)};
        moveAlgorithm(amtMove,algoX, algoY);
      }

    }

    let moveAlgorithm = (amtMove,algoX, algoY) => {
      let moveAmtX = amtMove.x / 50;
      let moveAmtY = amtMove.y / 50;
      let curAmtX = 0;
      let curAmtY = 0;
      let moveCt = 0;
      let moveAlgo = $interval(() => {
        curAmtX += moveAmtX;
        curAmtY += moveAmtY;
        algoDiagram1.style.left = (Number(algoX) - Number(curAmtX)) + 'px';
        algoDiagram1.style.top = (algoY - curAmtY) + 'px';
        moveCt++;
        if (moveCt === 50) {
          $interval.cancel(moveAlgo);
        }
      }, 10);
      if (document.getElementById('card-content-summary')) {
        document.getElementById('card-content-summary').style.display = 'none';
      }
      // document.getElementById ('card-content-301').className.replace(/\bcomplete\b/,'');
      // $scope.apply();
    }

    let findNodePosition =  (nodeIdNum) => {
      let posObj = {}
      angular.forEach(currentDiagramData, (row) => {
        angular.forEach(row, (itemNode) => {
          if (itemNode.id === nodeIdNum) {

            let refId = 'node-' + nodeIdNum + '-' + itemNode.ref;
            let transData =  document.getElementById(refId).getAttribute('transform')
            let dataArray = transData.split(',')
            let yMatrix = dataArray[dataArray.length - 1];

            posObj = {x:Number(dataArray[dataArray.length - 2]),y:Number(yMatrix.substr(0,yMatrix.length - 1))};
          }
        })
      })
      return posObj
    }

  }

}

export default exampleComponent;
