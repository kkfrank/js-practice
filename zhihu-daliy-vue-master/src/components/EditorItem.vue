<template>
	<div>
		<TopHeader title="主编资料">
			<span class="navbar-left" @click="routerBack" slot="left"><icon name="arrow-left"></icon></span>
		</TopHeader>
		<div>

		</div>

	</div>
</template>

<script>
	import TopHeader from '../components/TopHeader'
	import LeftBar from '../components/LeftBar.vue'
	import TopImgBox from '../components/TopImgBox.vue'
	import List from '../components/List.vue'
	import axios from 'axios'
	import API from '../constants/index.js'
	export default{
		created:function(){
		    //this.getNews()
		    this.$store.dispatch({
		    	type:"getHomeList"
		    })
		},
	 	methods:{
			showLeftBar(){
				this.$store.commit('toggleLeftBar')
			},
		},
		components:{
			TopHeader,
			LeftBar,
			TopImgBox,
			List
		},
		computed:{
			name(){
				console.log(this.$store.state.topBar.name)
				return this.$store.state.topBar.name
			},
			list:function(){
				return this.$store.state.list
			},
			sliderList(){
				return this.$store.state.sliderList
			}
		}
	}
</script>

<style>
	
</style>