import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import infiniteScroll from "vue-infinite-scroll";
// import VueLazyload from 'vue-lazyload'


import api from '@/network/home.js'//网络请求
import '@/assets/css/reset.css'    //CSS
import '@/router/permission'       //路由守卫
import '@/utils/localStorage'      //token持久化

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.use(infiniteScroll);//懒加载
// Vue.use(VueLazyload,{
//   preLoad:1.3,
//   error:'@/assets/img/加载中.gif',
//   loading:'@/assets/img/错误.gif',
//   attempt: 1
// })
const YUN = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


export{
  YUN
}

