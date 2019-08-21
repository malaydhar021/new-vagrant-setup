<template>
  <div>
    <app-historic-popup v-if="selectedComponent === 101"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    @submit-email="submitEmail"
                    :script_id="script_id"
                    :showDetails="show_details"
                    :showMessage="show_message"
                    v-cloak></app-historic-popup>
    <app-home-coming-popup v-if="selectedComponent === 102"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    @submit-email="submitEmail"
                    :script_id="script_id"
                    :showDetails="show_details"
                    :showMessage="show_message"
                    v-cloak></app-home-coming-popup>
    <app-momentum-popup v-if="selectedComponent === 103"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    @submit-email="submitEmail"
                    :script_id="script_id"
                    :showDetails="show_details"
                    :showMessage="show_message"
                    v-cloak></app-momentum-popup>
    <app-fusing-popup v-if="selectedComponent === 104"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    @submit-email="submitEmail"
                    :script_id="script_id"
                    :showDetails="show_details"
                    :showMessage="show_message"
                    v-cloak></app-fusing-popup>
    <app-evolver-popup v-if="selectedComponent === 105"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    @submit-email="submitEmail"
                    :script_id="script_id"
                    :showDetails="show_details"
                    :showMessage="show_message"
                    v-cloak></app-evolver-popup>
  </div>
</template>

<script>
import HistoricPopup from './HistoricPopUp.vue'
import HomeComingPopup from './HomeComingPopUp.vue'
import MomentumPopup from './MomentumPopUp.vue'
import FusingPopup from './FusingPopUp.vue'
import EvolverPopup from './EvolverPopUp.vue'
import { constants } from 'fs'
import { setTimeout } from 'timers'

export default {
  props: {
    data: {},
    exitPopUpdata: {},
    script_id: '',
    apiEndpoint: ''
  },

  name: 'mainexitpopup',

  data: function () {
    return {
      selectedComponent: '',
      show_details: {},
      show_message: false,
      appData: {},
      otherData: {}
    }
  },

  components: {
    appHistoricPopup: HistoricPopup,
    appHomeComingPopup: HomeComingPopup,
    appMomentumPopup: MomentumPopup,
    appFusingPopup: FusingPopup,
    appEvolverPopup: EvolverPopup
  },

  computed: {
  },

  methods: {

    /**
     * this function sets up exit popup
     * @param {object} data
     * @param {boolean} type
     */
    createExitPopUp () {
      this.appData = this.exitPopUpdata
      this.selectedComponent = this.appData.style !== null ? this.appData.style : 101
      this.otherData = this.data
    },

    /**
     * this function is to send email for subscription
     * @param {object} emaildata
     * @param {string} email
     */

    async submitEmail (value) {
      if (value) {
        // Call this method to get initial widget data
        try {
          let payload = {
            "email": value, 
            "exit_popup_id": this.appData.id
          }

          let response = await this.axios.post(`${this.axios.defaults.baseURL}`+`${this.script_id}`+`/postback`, payload)

          this.show_details = response.data
          this.show_message = true
        } catch (error) {
            console.log(error)
        }
      } else {
        console.log("Email field can't be blank")
      }
    },
  },

  mounted () {
    this.createExitPopUp()
  }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
</style>