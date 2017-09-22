import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Theme from '../views/Theme'
import Detail from '../views/Detail.vue'
import EditorList from '../components/EditorList'
import EditorItem from '../components/EditorItem'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes=[{
	path:'/',
	component:Home
},{
	path:'/about',
	component:About
},{
	path:'/detail/:id',
	component:Detail
},{
	path:"/theme/:id",
	component:Theme
},{
	path:"/editors",
	component:EditorList
},{
	path:"/editor/:id",
	component:EditorItem
}]

export default new VueRouter({
	routes
})
