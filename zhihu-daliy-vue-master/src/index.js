import Vue from 'vue'

import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import Icon from 'vue-awesome/components/Icon.vue'

import 'vue-awesome/icons'
Vue.component('icon',Icon)//全局组件

new Vue({
	el:'#root',
	router,
	store,
	template:'<App/>',
	components:{App}
})