<template>
  <div>
    <transition name="fade">
      <app-common-widget
        :selectedTemplate="selectedComponent"
        :audioVideoTemplate="selectedAudioVideoTemplate"
        :data="appData"
        :counter="counter"
        v-bind:key="counter"
        :isBranded="isBranded"
        :brandingData="brandingData"
        :timeOut="timeOut"
        :ongoingInterval="currentInterVal"
        @iterationStopped="timeOut = true"
        @iterationPaused="stopIteration()"
        @startIteration="reStartIteration()"
        v-cloak
      ></app-common-widget>
    </transition>
  </div>
</template>

<script>
import Vue from "vue"

/* import widgets */
import CommonWidget from "./CommonWidget.vue"

export default {
  props: {
    data: {},
    reviews: {},
    fromExitPopup: Boolean,
    script_id: ''
  },
  name: 'mainwidget',

  data: function() {
    return {
      selectedComponent: '',
      selectedAudioVideoTemplate: '',
      delayInBetweenSr: '',
      delayBeforeShowSr: '',
      srStayTime: '',
      curPageNo: 1,
      lastPageNo: '',
      counter: 0,
      currentInterVal: '',
      stopTimeout: '',
      timeOut: false,
      appData: {},
      stickyData: Array,
      isBranded: Boolean,
      brandingData: {}
    };
  },

  components: {
    appCommonWidget: CommonWidget
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

      switch (dataresponse.style) {
        case 100:
          vm.selectedComponent = 'popup_template_1'
          vm.selectedAudioVideoTemplate = 1
          break
        case 101:
          vm.selectedComponent = 'popup_template_2'
          vm.selectedAudioVideoTemplate = 2
          break
        case 102:
          vm.selectedComponent = 'popup_template_3'
          vm.selectedAudioVideoTemplate = 3
          break
        case 103:
          vm.selectedComponent = 'popup_template_4'
          vm.selectedAudioVideoTemplate = 4
          break
        case 104:
          vm.selectedComponent = 'popup_template_5'
          vm.selectedAudioVideoTemplate = 5
          break
        default:
          vm.selectedComponent = 'popup_template_1'
          vm.selectedAudioVideoTemplate = 1
          break
      }

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
