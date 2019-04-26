import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.API_HOST
axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.config.productionTip = false
Vue.prototype.axios = axios

new Vue({
  render: h => h(App)
}).$mount('#app')
