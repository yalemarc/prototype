//created by yale marc 12/14/16
import questHtml from './question-component.html'

/* eslint quotes: "off" , max-len: "off", angular/log: "off" */

let questionComponent = {
  template: questHtml,
  controllerAs: 'quesCtrl',
  bindings: {
    somedata :'@',
    ques: '@',
    closeq: '&'
  },
  controller: function() {
    this.closeQues = function() {
      // console.log('closeQues', this.ques, this.closeq);
      this.closeq();
    }

  }
}

export default questionComponent;
