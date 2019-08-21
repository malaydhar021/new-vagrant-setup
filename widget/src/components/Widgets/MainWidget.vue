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
import Vue from "vue"

/* import widgets */
import Rounded from "./Rounded.vue"
import Squared from "./Squared.vue"
import SquareElevated from "./SquareElevated.vue"
import TearDrop from "./TearDrop.vue"
import TearDropElevated from "./TearDropElevated.vue"

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
    async getAllReviews(type) {
      // Call this method to get initial widget data
      try {
        let vm = this
        //let response = await this.axios.get()
        let url = ''
        switch (type) {
          case 1: // get widget reviews
            url = `${this.axios.defaults.baseURL}`+`${this.script_id}`+`?page=${this.curPageNo}`
          break
          case 2: //get exitpopup reviews
            url = `${this.axios.defaults.baseURL}`+`${this.script_id}`+`/exit-popup?page=${this.curPageNo}`
          break
        }
        let response = await vm.axios.get(url)

        if (response.data.status && !vm.stickyData.length) {
          vm.stickyData = response.data.data.sticky_reviews.data
          vm.showPopUps()
        } else if (response.data.status && vm.stickyData.length) {
          vm.stickyData = vm.stickyData.concat(response.data.data.sticky_reviews.data)
        } else {
          console.log("SR script is not enabled for this domain!")
        }
      } catch (error) {
        console.log(error)
      }
    },

    showPopUps() {
      let vm = this;
      if (vm.currentInterVal) {
        window.clearInterval(vm.currentInterVal)
      }

      let intervalTime = vm.delayInBetweenSr + vm.srStayTime // setting interval time
      vm.currentInterVal = setInterval(function() {
        if ( vm.counter === vm.stickyData.length - 1 ) {
          vm.getNewPageData(vm.data.loop)
        }

        if (vm.counter < vm.stickyData.length) {
          vm.appData = vm.stickyData[vm.counter]
          vm.timeOut = false

          vm.stopTimeout = setTimeout(function() {
            vm.timeOut = true
            vm.appData = {}
            vm.counter++
          }, vm.srStayTime)
        }
      }, intervalTime)
    },

    getNewPageData(loop) {
      let vm = this
      if (vm.curPageNo < vm.lastPageNo) {
        vm.curPageNo++
        vm.fromExitPopup ? vm.getAllReviews(2) : vm.getAllReviews(1)
      } else if (vm.curPageNo === vm.lastPageNo && loop) {
        vm.curPageNo = 1
        vm.fromExitPopup ? vm.getAllReviews(2) : vm.getAllReviews(1)
      } else if (
        vm.curPageNo === vm.lastPageNo &&
        !loop &&
        vm.counter === vm.stickyData.length
      ) {
        window.clearTimeout(vm.stopTimeout)
        window.clearInterval(vm.currentInterVal)
        vm.counter = 0
      }
    },

    /**
     * this function sets up popups styling
     * @param {object} dataresponse
     * @param {boolean} type
     */
    createPopUps() {
      let vm                  = this
      let dataresponse        = vm.data
      vm.selectedComponent    = dataresponse.style ? dataresponse.style : 100

      // check branding is there or not
      if (dataresponse.is_brand_on) {
        vm.isBranded        = dataresponse.is_brand_on
        vm.brandingData     = dataresponse.brand
      }

      vm.delayInBetweenSr   = dataresponse.delay // this is the delay time inbetween two review
      vm.srStayTime         = dataresponse.stay_timing // this is the delay for each review to stay on the page

      vm.stickyData         = vm.reviews.data
      vm.lastPageNo         = vm.reviews.last_page

      vm.appData            = vm.stickyData[vm.counter]
      vm.timeOut            = false
      
      vm.stopTimeout = setTimeout(function() {
        vm.timeOut = true
        vm.counter++
      }, vm.srStayTime)

      vm.showPopUps()
    },

    stopIteration() {
    	clearTimeout(this.stopTimeout)
    },

    reStartIteration() {
      let vm = this;
      this.stopTimeout = setTimeout(function() {
        vm.timeOut = true
        vm.counter++
        vm.showPopUps()
      }, vm.srStayTime)
    }
  },

  mounted() {
    this.createPopUps()
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
