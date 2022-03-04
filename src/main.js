import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button } from 'element-ui';
import './utils/global'
import '../mock'
Vue.use(Button)

// 防抖 or 节流
import Debounce from '@/utils/debounce'
Vue.component('Debounce', Debounce)

// 科学计算法
import cal from './utils/calculation'
Vue.prototype.cal = cal

Vue.config.productionTip = false
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

