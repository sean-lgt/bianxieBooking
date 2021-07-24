import Vue from 'vue'
import Bmob from 'hydrogen-js-sdk';
import App from './App'
// 秘钥-值xxxx
Bmob.initialize('xxxx', 'xxxx');

Vue.config.productionTip = false
Vue.prototype.Bmob = Bmob;


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
