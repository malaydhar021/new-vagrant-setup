<template>
    <div class="exitPopup theme4 prevwPage">
        <div class="overlay nsm-overlay-open" :style="{background: data.popup_backdrop_color}">
            <div class="nsm-dialog nsm-dialog-animation-fade nsm-dialog-open">
                <div class="nsm-content">
                    <div class="nsm-body">
                        <div class="topSec" :style="{backgroundColor: data.header_background_color}">
                            <p><img src="../../assets/images/icon_mic_colored_1.png" alt=""></p>
                        </div>
                        <div class="bottomSec" v-bind:class="{ popupPresent: showWidget }">
                            <div class="rightSecContainer">
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
                                <form v-bind:class="[formError ? 'error' : '']" v-if="data.has_email_field && !showMessage">
                                    <input type="email" placeholder="Enter your email" v-model="subscribe_email" @change="checkEmail">
                                    <span class="msgError" v-if="formError">Please check your email</span>
                                    <button :style="{color: data.button_text_color, background: data.button_background_color}" @click="subscribeMe" type="button">{{data.button_text.charAt(0).toUpperCase()+data.button_text.slice(1)}}</button>
                                </form>

                                <div class="linkTo" v-if="!data.has_email_field && !showMessage">
                                    <a :href=data.button_url target="_blank" class="button-submit" :style="{color: data.cta_button_text_color, background: data.cta_button_background_color}">
                                    {{data.cta_button_text}}
                                    </a>
                                </div>

                                <div :style="{color: data.button_background_color}" class="linkTo statMsg_f" v-if="showMessage">
                                    <span>&#10004;</span> {{showDetails.message}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="nsm-dialog-btn-close" type="button" @click="popupClosed" :style="{background: data.header_background_color}">
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
        showDetails: {},
        script_id: '',
        showMessage: Boolean,
        method: { type: Function }
    },
    
    name: "fusingpopup",
    
    data: function () {
        return {
            componentName: 'Im fusing popup component',
            stickyReviews: {},
            exitPopData: {},
            showWidget: false,
            fromExitPopup: true,
            subscribe_email: '',
            formError: false
        }
    },

    components: {
        appMainWidget: MainWidget
    },

    computed: {
    },

    methods : {
        popupClosed () {
            this.$emit('popupClosed', true)
        },

        showWidgetPopups () {
            let vm = this
            if (vm.data.sticky_reviews.data.length) {
                vm.showWidget = true
                vm.stickyReviews = vm.data.sticky_reviews
            }
        },

        validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(email).toLowerCase())
        },

        subscribeMe () {
            let vm = this
            if (!vm.formError && vm.subscribe_email) {
                this.$emit('submit-email', vm.subscribe_email)
            } else {
                vm.checkEmail()
            }
        },

        checkEmail () {
            let vm = this
            if (vm.validateEmail(vm.subscribe_email)) {
                vm.formError = false
            } else {
                vm.formError = true
            }
        }
    },

    mounted () {
        this.showWidgetPopups()
    }
}
</script>