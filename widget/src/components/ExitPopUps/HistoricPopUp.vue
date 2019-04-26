<template>
    <div class="exitPopup theme1 prevwPage">
        <div class="overlay nsm-overlay-open" :style="{background: data.popup_backdrop_color}">
            <div class="nsm-dialog nsm-dialog-animation-fade nsm-dialog-open">
                <div class="nsm-content">
                    <div class="nsm-body">
                        <div class="leftSec" :style="{background: data.header_background_color}">
                            <img src="../../assets/images/icon_mic_white.png" alt="">
                            <h2 :style="{color: data.header_text_color}">{{data.header_text}}</h2>
                        </div>
                        <div class="rightSec" v-bind:class="{ popupPresent: showWidget }" :style="{background: data.body_background_color}">
                            <div class="rightSecContainer">
                                <p :style="{color: data.paragraph_text_color}">
                                    {{data.paragraph_text}}
                                </p>
                                <div class="exitP exitPg">
                                    <!-- <div class="popAdd vidPreV_parent"> -->
                                    <div class="popAdd">
                                        <transition name="slide" mode="out-in">
                                            <app-main-widget :data="otherData"
                                                        :reviews="stickyReviews"
                                                        v-if="showWidget"
                                                        :script_id="script_id"
                                                        :apiEndpoint="apiEndpoint"
                                                        :fromExitPopup="fromExitPopup"></app-main-widget>
                                        </transition>
                                    </div>
                                </div>
                                <form v-if="data.has_email_field">
                                    <input type="email" placeholder="Enter your email">
                                    <button :style="{color: data.button_text_color, background: data.button_background_color}">{{data.button_text.charAt(0).toUpperCase()+data.button_text.slice(1)}}</button>
                                </form>

                                <div class="linkTo" v-else>
                                    <a href="javascript:void(0)" class="button-submit" :style="{color: data.cta_button_text_color, background: data.cta_button_background_color}">
                                    {{data.cta_button_text}}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="nsm-dialog-btn-close" type="button" :style="{background: data.header_background_color}" @click="popupClosed"><img src="../../assets/images/close.svg" alt=""></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/css/exit-popup.css'

/* import widgets */
import MainWidget from '../Widgets/MainWidget.vue'

import Vue from 'vue'

export default {
    props: {
        data: {},
        otherData: {},
        script_id: '',
        apiEndpoint: ''
    },
    
    name: "historicpopup",
    
    data: function () {
        return {
            componentName: 'Im historic popup component',
            stickyReviews: {},
            exitPopData: {},
            showWidget: false,
            fromExitPopup: true
        }
    },

    components: {
        appMainWidget: MainWidget
    },

    computed: {
    },

    methods : {
        popupClosed () {
            this.$emit('popupClosed', true);
        },

        showWidgetPopups () {
            let vm = this
            if (vm.data.sticky_reviews.data.length) {
                vm.showWidget = true
                vm.stickyReviews = vm.data.sticky_reviews
            }
        }
    },

    mounted () {
        this.showWidgetPopups()
    }
}
</script>