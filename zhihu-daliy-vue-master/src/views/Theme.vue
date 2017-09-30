<template>
	<div>
		<TopHeader :title="name">
			<span @click="showLeftBar" class="navbar-left" slot="left">
				<icon name="bars" scale=1.2></icon>
			</span>

			<div class="navbar-right-theme" slot="right">
				<icon name="plus-circle" scale=1.2></icon>
				<!-- <icon name="minus-circle"></icon> -->
			</div>
		</TopHeader>

		<!-- <LeftBar></LeftBar> -->
		<div class="main">
			<TopImgBox :sliderList="sliderList" ></TopImgBox>
			<List :list="themeList"></List>
		</div>
	</div>
</template>

<script>
	import TopHeader from '../components/TopHeader'
	import LeftBar from '../components/LeftBar.vue'
	import TopImgBox from '../components/TopImgBox.vue'
	//import List from '../components/List.vue'
	import List from '../components/themeList.vue'
	import axios from 'axios'
	import API from '../constants/index.js'
	export default{
		created:function(){
		    this.$store.dispatch({
		    	type:"getThemeListNow",
		    	id:this.$route.params.id
		    })
		},
	 	methods:{
			showLeftBar(){
				this.$store.commit('showLeftBar')
			},
		},
		components:{
			TopHeader,
			LeftBar,
			TopImgBox,
			List
		},
		computed:{
			themeList(){
				const id=this.$route.params.id
				//const today=moment().format('YYYYMMDD')
				//console.log('today',this.$store.getters.homeDataList)

				//return this.$store.state.homeTodayData
				//console.log(id,this.$store.state.theme.themeList[id])
				return this.$store.state.theme.themeList[id]//.homeDataList
			},
			name(){
				console.log(this.$store.state.topBar.name)
				return this.$store.state.topBar.name
			},
			sliderList(){
				const id=this.$route.params.id
				if(this.$store.state.theme.themeList[id][0]){
					return this.$store.state.theme.themeList[id][0].background
				}
				return ''
				//return this.$store.state.home.homeList[0].top_stories || []
				console.log('sliderList',this.$store.state.theme.themeList[id])
				return this.$store.state.theme.themeList[id][0].background || ''
			}
		}
	}
</script>

<style>
	
</style>