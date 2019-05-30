<template>
  <div>
    <app-historic-popup v-if="selectedComponent === 100"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    :script_id="script_id"
                    v-cloak></app-historic-popup>
    <app-home-coming-popup v-if="selectedComponent === 101"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    :script_id="script_id"
                    v-cloak></app-home-coming-popup>
    <app-momentum-popup v-if="selectedComponent === 102"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    :script_id="script_id"
                    v-cloak></app-momentum-popup>
    <app-fusing-popup v-if="selectedComponent === 103"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    :script_id="script_id"
                    v-cloak></app-fusing-popup>
    <app-evolver-popup v-if="selectedComponent === 104"
                    :data="appData"
                    :otherData="otherData"
                    @popupClosed="selectedComponent = ''"
                    :script_id="script_id"
                    v-cloak></app-evolver-popup>
  </div>
</template>

<script>
import HistoricPopup from './HistoricPopUp.vue'
import HomeComingPopup from './HomeComingPopUp.vue'
import MomentumPopup from './MomentumPopUp.vue'
import FusingPopup from './FusingPopUp.vue'
import EvolverPopup from './EvolverPopUp.vue'

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
    }
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