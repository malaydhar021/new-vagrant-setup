<template>
  <div>
    <app-main-widget :data="appData" :reviews="stickyReviews" v-if="showWidget" :fromExitPopup="fromExitPopup" :script_id="script_id"></app-main-widget>
    <app-exit-popup :data="appData" :exitPopUpdata="exitPopUpData" v-if="showExitPopUp" :script_id="script_id"></app-exit-popup>
  </div>
</template>

<script>

/* import widgets */
import MainWidget from './components/Widgets/MainWidget.vue'

/* import exit popups */
import MainExitPopUp from './components/ExitPopUps/MainExitPopUp.vue'
import { setTimeout } from 'timers'

export default {
  name: 'app',
  data () {
    return {
      selectedPopupComponent: '',
      script_id: '',
      appData: Array,
      stickyReviews: {},
      exitPopUpData: {},
      showExitPopUp: false,
      showWidget: false,
      curPageNo: 1,
      fromExitPopup: false
    }
  },

  components: {
    appMainWidget: MainWidget,
    appExitPopup: MainExitPopUp
  },

  computed: {
    /**
     * this function gives back the campaign Id for which we need the sticky reviews
     */
    myApiId() {
      this.script_id = document.querySelector('script[data-name="_emv"][data-token]').getAttribute('data-token');
      return this.script_id;
    }
  },

  methods: {
    async getWidgetData () {
      // Call this method to get initial widget data
      try {

        let response = await this.axios.get(`${this.axios.defaults.baseURL}`+`${this.myApiId}`+`?page=${this.curPageNo}`)
        // let response = await this.axios.get(`https://api.beta.usestickyreviews.com/v2/widget/emv_root5d1f4a37aa8801562331703?page=${this.curPageNo}`)

        if (response.data.status) {
          this.checkDomainName(response.data.data)
        } else {
          console.log("SR script is not enabled for this domain!");
        }

      } catch (error) {
        console.log(error)
      }
    },

    async getPopUpData () {
      // Call this method to get initial popup data
      try {

        let response = await this.axios.get(`${this.axios.defaults.baseURL}`+`${this.script_id}`+`/exit-popup?page=${this.curPageNo}`)
        // let response = await this.axios.get(`https://api.beta.usestickyreviews.com/v2/widget/emv_root5d1f4a37aa8801562331703/exit-popup?page=${this.curPageNo}`)
        if (response.data.status) {
          this.pageLeft(response.data.data)
        } else {
          console.log("SR script is not enabled for this domain!");
        }

      } catch (error) {
        console.log(error)
      }
    },


    /**
     * this function checks the domain name for what it has been made for matched or not
     * @param {string} dataresponse
     */
    checkDomainName (dataresponse) {
      let vm = this
      vm.appData = dataresponse
      if (dataresponse.is_active) {
        if (window.location.host === dataresponse.domain_name) {
          // checking if any review is there or not. if there are then generate review popups
          if (dataresponse.sticky_reviews && dataresponse.sticky_reviews.data.length) {
            // Waiting time before start...
            if (dataresponse.delay_before_start) {
              setTimeout (function () {
                vm.showWidget = true
                vm.stickyReviews = dataresponse.sticky_reviews
              }, dataresponse.delay_before_start)
            } else {
              vm.showWidget = true
              vm.stickyReviews = dataresponse.sticky_reviews
            }
          }
          // Check exit popup ID & configrations are attached or not
          if (dataresponse.has_exit_pop_up) {
            vm.getPopUpData()
          }
        } else {
          console.error('[Sticky Reviews] Campaign URL did not match with current URL')
        }
      } else {
        console.error('[Sticky Reviews] This campaign is marked as inactive, Please reactivate it!')
      }
    },

    /**
     * this function sets up exit popup on page leave
     * @param {object} pageData
     * @param {boolean} type
     */
    pageLeft (pageData) {
      let vm = this
      // Call this method to open exit popup
      let mouseY = 0
      let topValue = 0

      window.addEventListener ('mouseout', function (e) {
        mouseY = e.clientY
        if (mouseY < topValue || mouseY === topValue) {
          vm.showExitPopUp = true
          vm.exitPopUpData = pageData
        }
      }, false)
    }
  },

  created () {

  },

  mounted () {
    this.getWidgetData()
  }

}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
