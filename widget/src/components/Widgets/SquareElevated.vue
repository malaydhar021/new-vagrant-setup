<template>
    <div>
        <!-- square elevated widget for text review start -->
        <div class="popupParent" v-if="data.type === 1 && !timeOut">
            <div class="popupTxt popup_template_4">
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
                        <span class="timePop">{{ data.created_at | moment('timezone', timezone, 'YYYY-MM-DDTHH:mm')  | moment("from") }}</span>
                        <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
                        <a :href="brandingData.url" target="_blank" v-if="isBranded">{{brandingData.name}}</a>

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
        <!-- square elevated widget for text review end -->

        <!-- square elevated widget for audio review start -->
        <div class="popupParent audioParent_3" v-if="data.type === 2 && !timeOut">
            <div class="popupTxt popup_template_3">
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
                                    @play="onPlayerPlay($event)"
                                    @pause="onPlayerPause($event)"
                                    @ended="onPlayerEnded($event)">
                        </AudioPlayer>
                    </div>

                    <footer class="popupFt">
                        <span class="timePop">{{ data.created_at | moment('timezone', timezone, 'YYYY-MM-DDTHH:mm')  | moment("from") }}</span>
                        <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
                        <a :href="brandingData.url" target="_blank" v-if="isBranded">{{brandingData.name}}</a>

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
        <!-- square elevated widget for audio review end -->

        <!-- square elevated widget for video review start -->
        <div class="popupParent vidParent_3" v-if="data.type === 3 && !timeOut">
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
                    <video-player class="vjs-custom-skin"
                        ref="videoPlayer"
                        :options="videoPlayerOptions"
                        :playsinline="true"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                        @ended="onPlayerEnded($event)"></video-player>
                </div>
            </div>
            <div class="popupTxt popup_template_3">
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
                        <span class="timePop">{{ data.created_at | moment('timezone', timezone, 'YYYY-MM-DDTHH:mm')  | moment("from") }}</span>
                        <span class="pwBy" v-if="isBranded"><img src="../../assets/images/icon_poweredby.png" alt="">by</span>
                        <a :href="brandingData.url" target="_blank" v-if="isBranded">{{brandingData.name}}</a>

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
        <!-- square elevated widget for video review end -->
    </div>

</template>

<script>
import '../../assets/css/popup.css'
// require styles
import 'video.js/dist/video-js.css'
import '../../assets/css/video-custom-theme.css'
import '@liripeng/vue-audio-player/lib/vue-audio-player.css'

import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import { videoPlayer } from 'vue-video-player'
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
        ongoingInterval: {}
    },
    name: 'squareelevated',
    data: function () {
        return {
            componentName: 'Im square elevated component',
            videoPlayerOptions: {},
            audioSource: []
        }
    },
    computed: {
        timezone: () => moment.tz.guess()
    },
    components: {
        videoPlayer: videoPlayer,
        AudioPlayer: AudioPlayer
    },
    methods: {
        stopIteration () {
            window.clearInterval(this.ongoingInterval)
            this.$emit('iterationStopped', true)
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
        }
    },
    beforeUpdate () {
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
