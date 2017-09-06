//DATA FOR EHR VERSION
// created by yale marc 05/31/2017
/* eslint quotes: "off" , max-len: "off", angular/log: "off", angular/document-service: "off" , no-undef: "off", angular/window-service: "off", angular/no-inline-template: "off", angular/timeout-service: "off" */

// import icgData from './icg.data.js';

var patientsData = [
  {
    name: "Bill Smith",
    allergies: "Peanuts, dust",
    IQHealth: "No",
    PCP: "Thomas, Peter",
    Phone: "",
    Age: "17 years",
    DOB: "4/29/2000",
    Wt: "",
    Sex: "Male",
    Pref: "Labs/Diagnostics:",
    MRN: "10002702",
    PatientID:"100",
    FIN: "20003412 [Admit Dt: 6/22/2016 2:05PM] Loc: IN, Baseline East",
    pathways:[{
      name: "Atrial fibrillation: Anticoagulation for adults with nonvalvular atrial fibrillation",
      ehr: true,
      description: "This UpToDate Pathway will help determine if an adulat with nonvalvular atrial fibrillation is likely  to benefit from chronic oral anticoagulation and guide clinicians in the appropriate choice of an oral anticoagulant for a give patient",
      refNum: '107764'
    },{
      name: "Hypertension: Initial management",
      ehr: true,
      description: "This UpToDate Pathway will help guide initial management of a an untreated patient diagnosed with hypertension. This advice is applicable to both diabetic patients and nondiabetic patients.",
      refNum: '109113'
    }
    ],
    searches:["Atrial fibrillation","Deep Vein Thrombosis","Headache","Heart Failure","Hypertension"]
  },{
    name: "Sara Jones",
    allergies: "Dogs, cats",
    IQHealth: "No",
    PCP: "Witherspoon, Samatha",
    Phone: "781-000-4567",
    Age: "40 years",
    DOB: "4/29/1976",
    Wt: "",
    Sex: "Female",
    Pref: "Labs/Diagnostics:",
    MRN: "10002703",
    PatientID:"200",
    FIN: "45008749 [Admit Dt: 1/26/2017 10:15AM] Loc: MA, Brigham East",
    pathways:[ {
      name: "Helicobacter pylori: Initial treatment for adults",
      ehr: true,
      description: "This UpToDate Pathway will help guide clinicians in selecting therapy for an adult with Helicobacter pylori infection who has not previously been treated. Several guidelines address the management of H. pylori. The recommendations in this UpToDate Pathway generally represent the recommendations from the Toronto guidelines.",
      refNum: '108537'
    } ],
    searches:["Digestion","Esophagogastric","Helicobacter Pylori","Infection"]
  },{
    name: "Sally Johnston Smithey",
    allergies: "Chocolate, shrimp",
    IQHealth: "No",
    PCP: "Gotlebieb, Rhonda",
    Phone: "",
    Age: "80 years",
    DOB: "4/29/1937",
    Wt: "",
    Sex: "Female",
    Pref: "Labs/Diagnostics:",
    MRN: "10002704",
    PatientID:"400",
    FIN: "77773434 [Admit Dt: 3/15/2017 4:45PM] Loc: MA, MGH West",
    pathways:[ {
      name: "Low back pain: Evaluation of an adult with acute, non-tramatic low back pain",
      ehr: true,
      description: "This UpToDate Pathway will help guide clinicians in the evaluation of adults with acute, non-traumatic low back pain. The evaluation may include a trial of conservative therapy, imaging of the lumbar spine, and/or evaluation of serum inflammatory markers. Choosing the correct approach depends on the patient's presentation and risk factors for malignancy, infection, and vertebral compression fractures.",
      refNum: '108277'
    } ],
    searches:["Back pain","Spinal issues"]
  },{
    name: "Charles Scrooge",
    allergies: "Chocolate, shrimp",
    IQHealth: "No",
    PCP: "Steinhart, Steven",
    Phone: "",
    Age: "63 years",
    DOB: "6/16/1954",
    Wt: "",
    Sex: "Male",
    Pref: "Labs/Diagnostics:",
    MRN: "200899456",
    PatientID:"400010050",
    FIN: "77773434 [Admit Dt: 3/15/2017 4:45PM] Loc: MA, MGH West",
    pathways:[ {
      name: "Type 2 diabetes mellitus: Initial therapy for improving glycemic control in adults",
      ehr: true,
      description: "This UpToDate Pathway will help guide clinicians in managing glycemic control in patients with type 2 diabetes mellitus who have not yet been treated.",
      refNum: '108537'
    } ],
    searches:["Diabetes","Hypertension","Hyperlipidemia","Kidney","Liver"]
  }
]

var patientNumber = null;
var showEHR = false;

Vue.component('ehr-pathway-option',{
  template:'<div><div class="ehr-pathway-title" @click="showPathway"><div class="ehr-algo-icon"></div>UpToDate Pathway: {{pathway.name}} <span v-show="pathway.ehr" class="ehr-data-icon">+EHR</span> <span class="ehr-beta-icon">Beta</span></div><div class="ehr-pathway-desc">{{pathway.description}}</div></div>',
  data: function () {
    return {

    }
  },
  methods: {
    showPathway: function() {
      if (this.pathway.ehr) {
        this.$emit('PathTrigger',this.pathway.refNum);
      }

    }
  },
  created: function () {

  },
  computed:{

  },
  props: [ 'pathway' ]
});

Vue.component('ehr-selection-panel',{
  template: '<div><div class="ehr-options-info-bar" >UpToDate information for {{infoBasis}} based on age, sex and active problems</div><div class="ehr-suggest-title"><strong>Suggested UpToDate Pathways</strong> </div><ehr-pathway-option v-on:PathTrigger="PathwayTrigger" v-for="pathway in pathways" :pathway="pathway" ></ehr-pathway-option><div><div class="ehr-pathway-title" @click="seeAllPathways"><div class="ehr-algo-icon"></div>See all UpToDate Pathways</div><br><div class="ehr-suggest-title"><strong>Suggested UpToDate Searches</strong></div><div class="ehr-search-title" v-for="search in searches">{{search}}</div></div>',
  data: function () {
    return {
      infoBasis:this.patientNameInfo,
      pathways: '',
      searches: '',
    }
  },
  methods: {
    PathwayTrigger: function(data) {
      this.$emit('showPathway', data)
    },
    patientUpdate: function(type) {
      console.log('GET PATIENT DATA', type)
    },
    seeAllPathways: function() {
      console.log('SHOW ALL PATHWAYS');
      this.pathwayActive = true;
      let mainUrlPath = '';
      var xIndex = window.location.href.indexOf('#')
      if (xIndex === -1) {
        mainUrlPath = window.location.href + '#/'
      } else {
        mainUrlPath = window.location.href.substr(0,xIndex + 2);
      }
      window.location.href = mainUrlPath + 'home';
      this.showOptions = false;
      this.$emit('hidePathway')
    }

  },
  created: function () {
    this.infoBasis = patientsData[patientNumber].name;
    this.pathways = patientsData[patientNumber].pathways;
    this.searches = patientsData[patientNumber].searches;
  },
  computed:{
    getPatientName:  function () {
      return "sam";
    }

  },
  events: {
  },
  props: ['ehr-header','patientNameInfo','patientUpdate']
});

Vue.component('ehr-title-panel',{
  template: '<div><div class="pathways-top-logo-panel" ><div id="icg-version-number" >Version 0619</div>' +
    '<div id="icg-topbar-links-row" ><div class="icg-topbar-link-text" >Welcome <span class="icg-topbar-link" >Dr. Smith, Peter K</span></div><div class="icg-topbar-link" >My Account</div><div class="icg-topbar-link" >Show all Pathways</div></div>' +
    '<div id="icg-search-box" >Search UpToDate <div class="pathways-search-icon" ></div></div>' +
    '<div id="pathways-hidden-menu-btn" ><i class="fa fa-bars" aria-hidden="true" ></i></div>' +
    '</div><div id="pathways-search-mobile-panel"></div>' +
    '<div id="icg-topbar-selections" ></div></div></div>'

});

Vue.component('ehr-header',{
  template: '<div><div class="ehr-tab-panel" ><div class="ehr-top-tab" @click="getData(0)" v-bind:class="tab0" >Bill Smith</div>' +
  '<div class="ehr-top-tab" @click="getData(1)" v-bind:class="tab1">Sara Jones</div>' +
  '<div class="ehr-top-tab" @click="getData(2)" v-bind:class="tab2">Sally Johnson Smithey</div>' +
  '<div class="ehr-top-tab" @click="getData(3)" v-bind:class="tab3">Charlie Scrooge</div></div>' +
  '<div class="ehr-header-block" >' +
  '<div class="ehr-info-panel">Allergies: {{patientData.allergies}}<br>IQHealth: {{patientData.IQHealth}}<br>PCP: {{patientData.PCP}}</div>' +
  '<div class="ehr-info-panel">Phone: {{patientData.Phone}}<br>Age: {{patientData.Age}}<br>DOB: {{patientData.DOB}}</div>' +
  '<div class="ehr-info-panel">Wt: {{patientData.Wt}}<br>Sex: {{patientData.Sex}}<br></div>' +
  '<div class="ehr-info-panel ehr-last-panel">Pref: {{patientData.Pref}}<br>MRN: {{patientData.MRN}}<br>Inpatient FIN: {{patientData.FIN}}</div></div>' +
  '<div class="ehr-side-panel"><div v-for="item in menuList" @click="showSelectOptions" class="ehr-side-item">{{item}}</div></div>' +
  '<div id="ehr-main-panel"><ehr-title-panel v-if="showOptions"></ehr-title-panel ><ehr-selection-panel v-on:showPathway="showPathway" v-on:hidePathway="hidePathway" v-if="showOptions" :patientNameInfo = "patientName" :patientUpdate="getData" ></ehr-selection-panel><div v-if="pathwayActive" id="app-wrapper" ui-view></div></div></div>',

  data: function () {
    return {
      showme: true,
      isActive: true,
      patientData: {},
      pathwayActive: true,
      patientNum: 0,
      patientName: '',
      showOptions: false,
      tab0: 'tabactive',
      tab1: '',
      tab2: '',
      tab3: '',
      mainUrlPath: '',
      menuItem: {},
      upToDateSelected: false,
      menuList: ['Menu','UpToDate Advanced','SMART App Valdator DSTU2','Histories','Medication List','Diagnoses and Problems','Patient Information','ehr-title-panel']
    }
  },
  methods: {
    getData: function(num) {
      console.log('GET DATA NUM', num)
      this.patientData = patientsData[num];
      if (num === 0) {
        this.tab0 = 'tabactive';
        this.tab1 = '';
        this.tab2 = '';
        this.tab3 = '';
      }
      if (num === 1) {
        this.tab0 = '';
        this.tab1 = 'tabactive';
        this.tab2 = '';
        this.tab3 = '';
      }
      if (num === 2) {
        this.tab0 = '';
        this.tab1 = '';
        this.tab2 = 'tabactive';
        this.tab3 = '';
      }
      if (num === 3) {
        this.tab0 = '';
        this.tab1 = '';
        this.tab2 = '';
        this.tab3 = 'tabactive';
      }
      this.pathwayActive = true;
      this.patientNum = num;
      patientNumber = num;
      //Set the patient number in angular portion so can get proper mock data
      // var angPatientData = icgData();
      // angPatientData.setPatientNumber(num)

      this.patientName = this.patientData.name;
      this.showOptions = false;
      if (this.upToDateSelected) {
        setTimeout(this.updateOptions,100)
      }
      this.setPathToHome();
    },
    updateOptions: function() {
      this.showOptions = true;
    },
    showSelectOptions: function(e) {
      // clear all menu items
      let menuItems = document.getElementsByClassName('ehr-side-item');
      for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].className = 'ehr-side-item';
      }
      if (e.target.innerText === 'UpToDate Advanced') {
        this.showOptions = true;
        this.menuItem = e.target;
        e.target.className = 'ehr-side-item active';
        this.upToDateSelected = true;
      } else {
        this.menuItem = e.target;
        this.menuItem.className = 'ehr-side-item active';
        this.showOptions = false;
        this.upToDateSelected = false;
        this.setPathToHome();
      }
    },
    setPanelSize: function() {
      document.getElementById('ehr-main-panel').style.width = (window.innerWidth - 180) + 'px';
    },
    showPathway: function (pathId) {
      console.log('show pathwya', this.patientData)
      this.pathwayActive = true;
      window.location.href = this.mainUrlPath + 'icg/' + pathId + '?pi=' + this.patientData.PatientID;
      this.showOptions = false;

    },
    hidePathway: function() {
      console.log('HIDE PATHWAY')
      this.showOptions = false;
    },
    setPathToHome: function() {
      var xIndex = window.location.href.indexOf('#')
      if (xIndex === -1) {
        this.mainUrlPath = window.location.href + '#/'
      } else {
        this.mainUrlPath = window.location.href.substr(0,xIndex + 2);
      }
      window.location.href = this.mainUrlPath + 'ehr';
      setTimeout(this.setPanelSize,200)
    }

  },
  created: function() {
    this.getData(0);


  },
  mounted: function() {
    this.setPanelSize();
    // Select UpToDate Advanced menu item as default on start
    this.showSelectOptions({target:{innerText:'UpToDate Advanced'}})
    document.getElementsByClassName('ehr-side-item')[1].className = 'ehr-side-item active'
  },
  computed: {
    tabTest: function(num) {
      return {'tabactive': true};
    }
  },
  events: {
  },
  props: ['topic','divwidth','patientsData','ehr-selection-panel']
});

Vue.component('sbs-pathway',{
  template:'<div><div  id="app-wrapper" ui-view></div></div>',
  data: function () {
    return {
      showPathway: true
    }
  },
  methods: {

    setPathToHome: function() {
      var xIndex = window.location.href.indexOf('#')
      if (xIndex === -1) {
        this.mainUrlPath = window.location.href + '#/'
      } else {
        this.mainUrlPath = window.location.href.substr(0,xIndex + 2);
      }
      window.location.href = this.mainUrlPath + 'home';
      setTimeout(this.setPanelSize,200)
    }
  },
  created: function () {
    // this.setPathToHome();
  },
  computed:{

  },
  props: []
});

Vue.component('ehr-main',{
  template:'<div><sbs-pathway v-if="!showEhrInterface"></sbs-pathway><ehr-header v-if="showEhrInterface"></ehr-header></div>',
  data: function () {
    return {
      showEhrInterface: true

    }
  },
  methods: {

  },
  created: function () {
    this.showEhrInterface = showEHR;
  },
  computed:{

  },
  props: []
});


var ehrVue = new Vue({
  el: '#ehrFrame',
  data: {

  },
  methods: {

  }

})

export {patientNumber,showEHR}
