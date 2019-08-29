<template>
  <div>
    <!-- rounded widget for text review start -->
    <div class="popupParent" v-if="data.type === 1 && !timeOut">
      <div class="popupTxt" :class="selectedTemplate">
        <div class="figPopup">
          <figure v-if="data.image_url">
            <img :src="data.image_url" alt="">
          </figure>
          <figure v-else>
            <img src="../../assets/images/face_icon.png" alt="">
          </figure>
        </div>
        <div class="bodyPopup">
          <h6>{{data.name}}</h6>
          <p>{{data.review}}</p>
          <footer class="popupFt">
            <span class="timePop">{{ getReviewTimeFormated(data.reviewed_at)+ ' ago' }}</span>
            <template v-if="isBranded && Object.keys(brandingData).length">
              <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
              <a :href="data.has_brand ? data.brands.url : brandingData.url" target="_blank" v-if="isBranded">{{data.has_brand ? data.brands.name : brandingData.name}}</a>
            </template>
            <figure class="rateStar" v-for="(item, index) in 5" :key="index">
              <i :class="index+1 <= data.rating ? 'star': 'star inactive'">
                &#9734;
              </i>
            </figure>
          </footer>
        </div>
        <a class="closePopup" aria-label="Close Popup" @click="stopIteration"></a>
      </div>
    </div>
    <!-- rounded widget for text review end -->

    <!-- rounded widget for audio review start -->
    <div class="popupParent" :class="'audioParent_'+audioVideoTemplate" v-if="data.type === 2 && !timeOut">
      <div class="popupTxt" :class="selectedTemplate">
        <div class="figPopup">
          <figure v-if="data.image_url">
            <img :src="data.image_url" alt="">
          </figure>
          <figure v-else>
            <img src="../../assets/images/face_icon.png" alt="">
          </figure>
        </div>
        <div class="bodyPopup">
          <h6>{{data.name}}</h6>
          <div class="audioRv">
            <AudioPlayer :audio-list="audioSource"
                         :show-play-button="true"
                         :show-prev-button="false"
                         :show-next-button="false"
                         :progressInterval="1"
                         @play="onPlayerPlay($event)"
                         @pause="onPlayerPause($event)">
            </AudioPlayer>
          </div>

          <footer class="popupFt">
            <span class="timePop">{{ getReviewTimeFormated(data.reviewed_at)+ ' ago'}}</span>
            <template v-if="isBranded && Object.keys(brandingData).length">
              <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
              <a :href="data.has_brand ? data.brands.url : brandingData.url" target="_blank" v-if="isBranded">{{data.has_brand ? data.brands.name : brandingData.name}}</a>
            </template>
            <figure class="rateStar" v-for="(item, index) in 5" :key="index">
              <i :class="index+1 <= data.rating ? 'star': 'star inactive'">
                &#9734;
              </i>
            </figure>
          </footer>
        </div>
        <a class="closePopup" aria-label="Close Popup" @click="stopIteration"></a>
      </div>
    </div>
    <!-- rounded widget for audio review end -->

    <!-- rounded widget for video review start -->
    <div class="popupParent" :class="'vidParent_'+audioVideoTemplate" v-if="data.type === 3 && !timeOut">
      <div class="vidPop">
        <div class="animateVid">
          <span class="keyF1">

          </span>
          <span class="keyF2">

          </span>
          <span class="keyF3">

          </span>
          <span class="keyF4">

          </span>
          <span class="keyF5">

          </span>
          <span class="keyF6">

          </span>
        </div>
        <div class="vidContain">
          <tier5-video-player :width="300" :height="150" :video="videoSource" @playProcess="onPlayerPlay" @pauseProcess="onPlayerPause"
                              @endProcess="onPlayerEnded" @loadEndProcess="loadEndProcess" @loadStartProcess="loadStartProcess"></tier5-video-player>
        </div>
      </div>
      <div class="popupTxt" :class="selectedTemplate">
        <div class="figPopup">
          <figure v-if="data.image_url">
            <img :src="data.image_url" alt="">
          </figure>
          <figure v-else>
            <img src="../../assets/images/face_icon.png" alt="">
          </figure>
        </div>
        <div class="bodyPopup">
          <h6>{{data.name}}</h6>
          <footer class="popupFt">
            <span class="timePop">{{ getReviewTimeFormated(data.reviewed_at)+ ' ago' }}</span>
            <template v-if="isBranded && brandingData && Object.keys(brandingData).length">
              <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
              <a :href="data.has_brand ? data.brands.url : brandingData.url" target="_blank" v-if="isBranded">{{data.has_brand ? data.brands.name : brandingData.name}}</a>
            </template>
            <figure class="rateStar" v-for="(item, index) in 5" :key="index">
              <i :class="index+1 <= data.rating ? 'star': 'star inactive'">
                &#9734;
              </i>
            </figure>
          </footer>
        </div>
        <a class="closePopup" aria-label="Close Popup" @click="stopIteration"></a>
      </div>
    </div>
    <!-- rounded widget for video review end -->
  </div>
</template>

<script>
import '../../assets/css/popup.css'
// require styles
import '../../assets/css/video-custom-theme.css'
import '@liripeng/vue-audio-player/lib/vue-audio-player.css'

import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import tier5VideoPlayer from './player'
import { AudioPlayer } from '@liripeng/vue-audio-player'
Vue.use(VueMoment, {
  moment
})

export default {
  props: {
    data: {},
    counter: {
      type: Number,
      default: 0
    },
    isBranded: {},
    brandingData: {},
    timeOut: {
      type: Boolean,
      default: false
    },
    ongoingInterval: {},
    selectedTemplate: {
      type: String,
      default: ''
    },
    audioVideoTemplate: {}
  },
  name: 'commonWidget',
  data: function () {
    return {
      componentName: 'Im common widget component',
      videoPlayerOptions: {},
      audioSource: [],
      videoSource: ''
    }
  },
  components: {
    tier5VideoPlayer: tier5VideoPlayer,
    AudioPlayer: AudioPlayer
  },

  computed: {
  },
  methods: {
    stopIteration () {
      window.clearInterval(this.ongoingInterval)
      this.$emit('iterationStopped', true)
    },
    loadEndProcess () {
      this.$emit('startIteration', true)
    },
    loadStartProcess () {
      window.clearInterval(this.ongoingInterval)
      this.$emit('iterationPaused', true)
    },
    // listen event
    onPlayerPlay(player) {
      window.clearInterval(this.ongoingInterval)
      this.$emit('iterationPaused', true)
    },
    onPlayerPause(player) {
      this.$emit('startIteration', true)
    },
    onPlayerEnded(player) {
      this.$emit('startIteration', true)
    },
    getReviewTimeFormated(reviewAt) {
      const reviewTime = moment.utc(reviewAt).local().format('YYYY-MM-DD HH:mm:ss')
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
      const timeDiffrence = moment(currentTime).diff(moment(reviewTime))
      return moment.duration(timeDiffrence).humanize()
    }
  },
  beforeUpdate () {
    let vm = this
    this.audioSource = []
    this.audioSource.push(this.data.review)
    this.videoSource = vm.data.review
    this.videoPlayerOptions = {
      // videojs options
      muted: true,
      language: 'en',
      sources: [{
        src: vm.data.review
      }],
      fluid: false
    }
  },
  mounted () {
    let vm = this
    this.audioSource = []
    this.audioSource.push(this.data.review)
    this.videoPlayerOptions = {
      // videojs options
      muted: true,
      language: 'en',
      sources: [{
        src: vm.data.review
      }],
      fluid: false
    }
  }
}

</script>

<style lang="scss">
.audio-section__progress-container {
  pointer-events: none !important;
}
</style>
