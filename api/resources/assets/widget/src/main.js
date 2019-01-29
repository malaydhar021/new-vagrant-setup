import Vue from 'vue';
import VModal from 'vue-js-modal';

import App from './App.vue';

Vue.use(VModal);

const vm = new Vue({
  render: h => h(App),
  data: {
    random_div_id: 0,
  },
  computed: {
    /**
     * this function generate random div id which needs to be appended in run time
     * @returns {number|*}
     */
    myDivId: function () {
      this.random_div_id = Math.floor(Math.random()*90000) + 10000;
      return 'div'+this.random_div_id;
    },
  },
  methods: {
    /**
     * creates the DOM element where vue js can work
     */
    createDomElement: function () {
      const div           = document.createElement("div");
      div.id              = this.myDivId;
      document.body.appendChild(div);
    },
  }
});
vm.createDomElement();
/* mounting with the div id */
vm.$mount('#'+vm.myDivId);

console.log(vm.myDivId);
