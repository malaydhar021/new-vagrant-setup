<template>
    <div class="exitPopup theme5 prevwPage">
        <div class="overlay nsm-overlay-open" :style="{background: data.popup_backdrop_color}">
            <div class="nsm-dialog nsm-dialog-animation-fade nsm-dialog-open">
                <div class="nsm-content">
                    <div class="nsm-body">
                        <div class="topSec" v-bind:class="{ popupPresent: showWidget }" :style="{background: data.header_background_color}">
                            <h2 :style="{color: data.header_text_color}">{{data.header_text}}</h2>
                            <p :style="{color: data.paragraph_text_color}">
                                    {{data.paragraph_text}}
                            </p>
                            <div class="exitP exitPg" v-if="showWidget">
                                <div class="popAdd">
                                    <app-main-widget :data="otherData"
                                        :reviews="stickyReviews"
                                        :script_id="script_id"
                                        :fromExitPopup="fromExitPopup"></app-main-widget>
                                </div>
                            </div>
                        </div>
                        <div class="btmSec">
                            <form v-if="data.has_email_field">
                                <input type="text" placeholder="Enter your email">
                                <button :style="{color: data.button_text_color, background: data.button_background_color}">{{data.button_text.charAt(0).toUpperCase()+data.button_text.slice(1)}}</button>
                            </form>

                            <div class="linkTo" v-else>
                                <a href="javascript:void(0)" class="button-submit" :style="{color: data.cta_button_text_color, background: data.cta_button_background_color}">
                                    {{data.cta_button_text}}
                                </a>
                            </div>
                        </div>
                    </div>
                    <button class="nsm-dialog-btn-close" type="button" @click="popupClosed" :style="{background: data.header_background_color}">
                        <img src="../../assets/images/close.svg" alt="">
                    </button>
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
    
    name: "evolverpopup",
    
    data: function () {
        return {
            componentName: 'Im evolver popup component',
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