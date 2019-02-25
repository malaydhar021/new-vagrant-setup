<template>
  <modal name="exit-pop-up-modal">
    <div class="header" v-bind:style="{background: data.header_background_color}">
      <div class="container newcont">
        <div class="row popupHeader">
          <h2 v-bind:style="{color: data.header_text_color}">{{ data.header_text }}</h2>
          <p v-if="data.semi_header_text" v-bind:style="{color: data.semi_header_text_color}">{{ data.semi_header_text }}</p>
        </div>
      </div>
    </div>
    <div class="body popupBody" v-bind:style="{background: data.body_background_color}">
      <div class="container newcont">
        <div class="popupContent">
          <transition name="slide">
            <app-sub-rounded v-if="selectedSubComponent === 'appSubRounded'"
                            :dataSet="roundedPopUpDataset"
                            :counter="iteration"
                            :imageStorage="imageStoragePath"
                            :brandingFlg="brandingFlg"
                            :brandData="brandData"
                            v-bind:key="iteration" v-cloak></app-sub-rounded>
            <app-sub-squared v-if="selectedSubComponent === 'appSubSquared'"
                            :dataSet="squaredPopUpDataSet"
                            :counter="iteration"
                            :imageStorage="imageStoragePath"
                            :brandingFlg="brandingFlg"
                            :brandData="brandData"
                            v-bind:key="iteration" v-cloak></app-sub-squared>
          </transition>
        </div>
        <div class="cta">
          <button v-on:click="gotoURL()" v-bind:class="this.fullCampaignResponse.exit_pop_up.btn_size === 'L' ? 'btn-large': 'btn-small'" v-bind:style="{background: this.fullCampaignResponse.exit_pop_up.btn_color, color: this.fullCampaignResponse.exit_pop_up.btn_text_color}">{{ this.fullCampaignResponse.exit_pop_up.btn_text }}</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  import round from './exit-pop-up-subs/rounded.vue';
  import square from './exit-pop-up-subs/squared.vue';
  import Constant from '../constant';
    export default {
        name: "exitpopup",
        props: {
          data: {
            default: []
          },
          fullCampaignResponse: {
            default: []
          }
        },
        data: function () {
         return {
           selectedSubComponent: '',
           roundedPopUpDataset: '',
           squaredPopUpDataSet: '',
           imageStoragePath: '',
           brandingFlg: false,
           brandData: '',
           iteration: 0,
           cta_url: ''
         }
        },
        components: {
          appSubRounded: round,
          appSubSquared: square
        },
        methods: {
          show () {
            // console.log(this.fullCampaignResponse.exit_pop_up);
            // console.log(this.fullCampaignResponse);
            if (this.fullCampaignResponse.sticky_reviews !== null) {
              if (this.fullCampaignResponse.sticky_reviews.length > 0) {
                // setting up the decision based on what type of review it is
                if (this.fullCampaignResponse.styles === 'square') {
                  this.squaredPopUpDataSet = this.fullCampaignResponse.sticky_reviews;
                  this.selectedSubComponent = 'appSubSquared';
                } else {
                  this.roundedPopUpDataset = this.fullCampaignResponse.sticky_reviews;
                  this.selectedSubComponent = 'appSubRounded';
                }
                // take the image path for sticky reviews
                this.imageStoragePath = Constant.IMAGE_STORAGE_PATH;
                // set the branding if any
                this.brandingFlg = this.fullCampaignResponse.branding ===  1 ? true: false;
                this.brandData = this.fullCampaignResponse.branding_details;
                // cta link url
                this.cta_url = this.fullCampaignResponse.exit_pop_up.cta_link_url;
                // console.log(this.cta_url);
                // iteration
                let vmm = this;
                setInterval(function () {
                  if (vmm.iteration === vmm.fullCampaignResponse.sticky_reviews.length -1) {
                    vmm.iteration = 0;
                  } else {
                    vmm.iteration++;
                  }
                },vmm.fullCampaignResponse.delay);
              } else {
                console.warn('[Sticky Reviews warn::]- ' + 'Empty set of sticky reviews');
              }
            } else {
              console.warn('[Sticky Reviews warn::]- ' + 'Empty set of sticky reviews');
            }
            this.$modal.show('exit-pop-up-modal');
          },
          hide () {
            this.$modal.hide('exit-pop-up-modal');
          },
          gotoURL() {
            // console.log('here');
            window.location.href = this.cta_url;
          }
        },
        /**
         * calling the modal on component load
         */
        mounted() {
          this.show();
        }
    }
</script>

<style>

.newcont{
  width: 100% !important;
}
  .header .container .row h2{
    text-align: center;
    padding: 8px 0;
    margin: 0px auto;

  }
  .header .container .row p{
    font-size: 18px;
    margin: 0;
    text-align: center;
    padding: 0 0 10px 0;
    /*margin: 0 -15px 15px -15px;*/
  }
  .slide-leave-active,
  .slide-enter-active {
    transition: 1s;
  }
  .slide-enter-active {
    margin-top: -27.5%;
  }
  .slide-enter {
    transform: translate(200%, 0);
  }
  .slide-leave-to {
    transform: translate(-200%, 0);
  }
  .popupHeader{
    margin-top: 15px;
     margin: 0px auto;
    left: 0;
    right: 0;
    width:77%;
    padding-top:20px;

  }
  .popupBody{
    padding: 35px 0 25px;
    margin-top: -15px;
    border-radius: 0;
    height: auto;
  }
  .popupContent{
    display: inline-block;
    /*margin-left: 50%;*/
    /*margin-left: calc(50% - 10px);
    transform: translateX(-50%);*/
    padding-left: calc(50% - 32%);
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
  .v--modal{
    border-radius: 7px;
  }
  .v--modal-overlay .v--modal-box {
    height: auto !important;
  }
  .v--modal-box.v--modal .header{
    display: inline-block;
    width: 100%;
  }
.v--modal-box.v--modal .header .popupHeader {
    padding: 10px 0;
  }
  /*v--modal-box v--modal{*/
    /*top: 174px;*/
    /*left: 0;*/
    /*right: 0;*/
    /*width: 30%;*/
    /*margin: 0px auto;*/
    /*height: auto;*/
  /*}*/
  .cta {
    text-align: center;
  }
  .btn-large {
    height: 40px;
    width: 98%;
    border: none;
  }
  .btn-small {
    height: 30px;
    width: 50%;
    border: none;
  }
</style>
