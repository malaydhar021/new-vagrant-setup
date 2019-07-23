<template>
  <div>
    <transition name="fade">
      <app-rounded
        v-if="selectedComponent === 100"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="selectedComponent = ''"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-rounded>
      <app-squared
        v-if="selectedComponent === 101"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="selectedComponent = ''"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-squared>
      <app-square-elevated
        v-if="selectedComponent === 102"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="selectedComponent = ''"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-square-elevated>
      <app-tear-drop
        v-if="selectedComponent === 103"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="selectedComponent = ''"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-tear-drop>
      <app-tear-drop-elevated
        v-if="selectedComponent === 104"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="selectedComponent = ''"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-tear-drop-elevated>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";

/* import widgets */
import Rounded from "./Rounded.vue";
import Squared from "./Squared.vue";
import SquareElevated from "./SquareElevated.vue";
import TearDrop from "./TearDrop.vue";
import TearDropElevated from "./TearDropElevated.vue";

export default {
  props: {
    data: {},
    reviews: {},
    fromExitPopup: Boolean,
    script_id: ""
  },
  name: "mainwidget",

  data: function() {
    return {
      selectedComponent: "",
      delayInBetweenSr: "",
      delayBeforeShowSr: "",
      srStayTime: "",
      curPageNo: 1,
      lastPageNo: "",
      counter: 0,
      currentInterVal: "",
      stopTimeout: "",
      timeOut: false,
      appData: {},
      stickyData: Array,
      isBranded: Boolean,
      brandingData: {}
    };
  },

  components: {
    appRounded: Rounded,
    appSquared: Squared,
    appSquareElevated: SquareElevated,
    appTearDrop: TearDrop,
    appTearDropElevated: TearDropElevated
  },

  computed: {
    timezone: () => moment.tz.guess()
  },

  methods: {
    async getReviews() {
      // Call this method to get initial widget data
      try {
        let vm = this;
        // let response = await this.axios.get(`${this.axios.defaults.baseURL}`+`${this.script_id}`+`?page=${this.curPageNo}`)
        let response = await this.axios.get(`https://api.beta.usestickyreviews.com/v2/widget/emv_root5d1f4a37aa8801562331703?page=${this.curPageNo}`)

        if (response.data.status && !vm.stickyData.length) {
          vm.stickyData = response.data.data.sticky_reviews.data;
          this.showPopUps();
        } else if (response.data.status && vm.stickyData.length) {
          response.data.data.sticky_reviews.data.forEach(function(v, i) {
            vm.stickyData.push(v);
          });
        } else {
          console.log("SR script is not enabled for this domain!");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getPopupReviews() {
      // Call this method to get initial widget data
      try {
        let vm = this;
        // let response = await this.axios.get(`${this.axios.defaults.baseURL}`+`${this.script_id}`+`/exit-popup?page=${this.curPageNo}`)
        let response = await this.axios.get(`https://api.beta.usestickyreviews.com/v2/widget/emv_root5d1f4a37aa8801562331703/exit-popup?page=${this.curPageNo}`)

        if (response.data.status && !vm.stickyData.length) {
          vm.stickyData = response.data.data.sticky_reviews.data;
          this.showPopUps();
        } else if (response.data.status && vm.stickyData.length) {
          response.data.data.sticky_reviews.data.forEach(function(v, i) {
            vm.stickyData.push(v);
          });
        } else {
          console.log("SR script is not enabled for this domain!");
        }
      } catch (error) {
        console.log(error);
      }
    },

    showPopUps() {
      let vm = this;
      if (vm.currentInterVal) {
        window.clearInterval(vm.currentInterVal);
      }

      let intervalTime =
        vm.delayInBetweenSr > vm.srStayTime
          ? vm.delayInBetweenSr
          : vm.delayInBetweenSr + vm.srStayTime;
      vm.currentInterVal = setInterval(function() {
        if (vm.counter < vm.stickyData.length) {
          vm.appData = vm.stickyData[vm.counter];
          vm.timeOut = false;
          vm.stopTimeout = setTimeout(function() {
            vm.timeOut = true;
            vm.appData = {};
            vm.counter++;
          }, vm.srStayTime);
        }

        if (
          vm.counter === vm.stickyData.length - 2 ||
          vm.counter === vm.stickyData.length
        ) {
          vm.getNewPageData(vm.data.loop);
        }
      }, intervalTime);
    },

    getNewPageData(loop) {
      let vm = this;
      if (vm.curPageNo < vm.lastPageNo) {
        vm.curPageNo++;
        vm.fromExitPopup ? vm.getPopupReviews() : vm.getReviews();
      } else if (vm.curPageNo === vm.lastPageNo && loop) {
        vm.curPageNo = 1;
        vm.fromExitPopup ? vm.getPopupReviews() : vm.getReviews();
      } else if (
        vm.curPageNo === vm.lastPageNo &&
        !loop &&
        vm.counter === vm.stickyData.length
      ) {
        window.clearTimeout(vm.stopTimeout);
        window.clearInterval(vm.currentInterVal);
        vm.counter = 0;
      }
    },

    /**
     * this function sets up popups styling
     * @param {object} dataresponse
     * @param {boolean} type
     */
    createPopUps() {
      let dataresponse = this.data;
      this.selectedComponent = dataresponse.style ? dataresponse.style : 100;

      // check branding is there or not
      if (dataresponse.is_brand_on) {
        this.isBranded = dataresponse.is_brand_on;
        this.brandingData = dataresponse.brand;
      }

      this.delayInBetweenSr = dataresponse.delay; // this is the delay time inbetween two review
      this.srStayTime = dataresponse.stay_timing; // this is the delay for each review to stay on the page

      this.stickyData = this.reviews.data;
      this.lastPageNo = this.reviews.last_page;

      this.appData = this.stickyData[this.counter];
      this.timeOut = false;
      let vm = this;
      this.stopTimeout = setTimeout(function() {
        vm.timeOut = true;
        vm.counter++;
      }, vm.srStayTime);

      this.showPopUps();
    },

    stopIteration() {
      clearTimeout(this.stopTimeout);
    },

    reStartIteration() {
      let vm = this;
      this.stopTimeout = setTimeout(function() {
        vm.timeOut = true;
        vm.counter++;
        vm.showPopUps();
      }, vm.srStayTime);
    }
  },

  mounted() {
    this.createPopUps();
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
