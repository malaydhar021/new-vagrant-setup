<template>
  <div id="App">
    <div v-if="typeof squaredPopUpData === 'object' || typeof roundedPopUpData === 'object'">
      <transition name="fade" mode="out-in">
        <app-squared v-if="selectedComponent === 'appSquared'"
                     :data="squaredPopUpData"
                     :counter="myCounter"
                     :imageStorage="myStoragePath"
                     :isBranded="isBranded"
                     :brandingData="brandingData"
                     v-bind:key="myCounter"
                     :ongoingInterval="parentInterval"
                     @iterationStopped="selectedComponent = ''" v-cloak></app-squared>
        <app-rounded v-if="selectedComponent === 'appRounded'"
                     :data="roundedPopUpData"
                     :counter="myCounter"
                     :imageStorage="myStoragePath"
                     :isBranded="isBranded"
                     :brandingData="brandingData"
                     v-bind:key="myCounter"
                     :ongoingInterval="parentInterval"
                     @iterationStopped="selectedComponent = ''" v-cloak></app-rounded>
      </transition>
    </div>
    <app-exitpopup v-if="exitPopUpFlg"
                    :data = "expData"
                    :fullCampaignResponse="campaignResp"></app-exitpopup>
  </div>
</template>

<script>
  /**
   * NOTE: written and maintained in ECMA6 version. Make sure you use the same
   * version when you try to code even more touch.
   * @author Tier5 LLC <work@tier5.us>
   */
  import squared from './components/squared.vue';
  import rounded from './components/rounded.vue';
  import axios from 'axios';
  import _ from 'lodash';
  import exitpopup from './components/exitpopup'
  import Constant from './constant';
  export default {
    name: 'app',
    data () {
      return {
        selectedComponent: '',
        myapiURL: '',
        campaignId: '',
        erros: [],
        switchme: true,
        squaredPopUpData: Array,
        roundedPopUpData: Array,
        myCounter: 0,
        myStoragePath: '',
        isBranded: Boolean,
        brandingData: Object,
        myStyleBackend: '',
        parentInterval: '',
        exitPopUpFlg: false,
        expData: '',
        campaignResp: ''
      };
    },
    components: {
      appSquared: squared,
      appRounded: rounded,
      appExitpopup: exitpopup
    },
    computed: {
      /**
       * this function gives back the campaign Id for which we need the sticky reviews
       */
      myApiId() {
        this.campaignId = document.querySelector('script[data-name="_emv"][data-token]').getAttribute('data-token');
        return this.campaignId;
      },
    },
    methods: {
      /**
       * this function fires up a request to backend to get all the details of a campaign
       */
      showComponent() {
        try {
          axios.get(Constant.API_URL + 'campaign-details/' + this.myApiId)
            .then(data => {
              if (data.status === 200 && data.statusText === "OK") {
                this.checkDomainName(data.data.response);
              } else {
                console.error('[Sticky Reviews] Something went wrong while fetching campaign data!');
              }
            })
            .catch(e => {
              this.erros.push(e);
              console.error('[Sticky Reviews]', e);
            });
        } catch (e) {
          console.error('[Sticky Reviews]', e);
        }
      },
      /**
       * this function checks the domain name for what it has been made for matched or not
       * @param {string} dataresponse
       */
      checkDomainName(dataresponse) {
        if (dataresponse.is_active !== "1") {
          if (window.location.origin == dataresponse.domain_name || window.location.origin+'/' == dataresponse.domain_name) {
            console.info('[Sticky Reviews] Waiting time... ' + dataresponse.delay_before_start + ' ms');
            var vm_parent  = this;
            if (dataresponse.delay_before_start && dataresponse.delay_before_start !== 0) {
              setTimeout(function () {
                vm_parent.createPopUps(dataresponse);
              },dataresponse.delay_before_start);
            } else {
              this.createPopUps(dataresponse);
            }
            // Check exit popup ID & configrations are attached or not
            if (dataresponse.exit_pop_up_id && !_.isEmpty(dataresponse.exit_pop_up)) {
              // for exit pop up fire this
              this.pageLeft(dataresponse);
            }
          } else {
            console.error('[Sticky Reviews] Campaign URL did not match with current URL');
          }
        } else {
          console.error('[Sticky Reviews] This campaign is marked as inactive, Please reactivate it!');
        }
      },
      /**
       * this function sets up actual array index which we are passing and data shows up forever
       * @param {object} wholeresponse
       * @param {boolean} type
       */
      createPopUps(wholeresponse) {
        if (wholeresponse) {
          if (wholeresponse.sticky_reviews !== null) {
            if (wholeresponse.sticky_reviews.length > 0) {
              this.myStoragePath = Constant.IMAGE_STORAGE_PATH;
              if (wholeresponse.styles === 'square') {
                this.squaredPopUpData = wholeresponse.sticky_reviews;
                this.selectedComponent = 'appSquared';
              } else {
                this.roundedPopUpData = wholeresponse.sticky_reviews;
                this.selectedComponent = 'appRounded';
              }
              // check branding is there or not
              this.isBranded = wholeresponse.branding ===  1 ? true: false;
              this.brandingData = wholeresponse.branding_details;
              let vm = this;
              let myInterVal = setInterval(function () {
                if (vm.myCounter === wholeresponse.sticky_reviews.length -1) {
                  if (wholeresponse.loop === '1' || wholeresponse.loop === 1) {
                    vm.myCounter = 0;
                  } else {
                    window.clearInterval(this);
                    vm.selectedComponent = '';
                  }
                } else {
                  vm.myCounter++;
                }
              },wholeresponse.delay);
              this.parentInterval = myInterVal;
            } else {
              console.warn('[Sticky Reviews] Empty set of sticky reviews');
            }
          } else {
            console.warn('[Sticky Reviews] Empty set of sticky reviews');
          }
        } else {
          console.error('[Sticky Reviews] Empty response!');
        }
      },
      pageLeft(pageData) {
        let vmRef = this;
        if (pageData.is_active === '0') {
          window.addEventListener('mousemove', function (event) {
            if (event.clientY <= 4) {
              console.info('[Sticky Reviews] Exit pop up fired!');
              vmRef.expData = pageData.exit_pop_up;
              vmRef.campaignResp = pageData;
              vmRef.exitPopUpFlg = true;
            } else {
              // vmRef.exitPopUpFlg = false;
            }
          });
        } else {
          console.warn('[Sticky Reviews] Inactive Campaign');
        }
      }
    },
    /**
     * calling a method on page load using life cycle hook
     * I choose mounted rather beforeMount just because vue js uses virtual DOM so
     * it also keep the track of the value changes on mount if there is any
     */
    mounted () {
      console.log(Constant.API_URL);
      this.showComponent();
    }
  }
</script>

<style scoped>
  #App {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999999;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  [v-cloak] {
    display: none;
  }
</style>
