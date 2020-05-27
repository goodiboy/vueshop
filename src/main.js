import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './http'
import './plugins/element.js'
import './assets/css/global.less'
import './assets/fonts/iconfont.css'
import store from './store'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
