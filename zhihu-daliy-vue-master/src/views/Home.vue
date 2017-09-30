<template>
	<div>
		<TopHeader title="首页">
			<span @click="showLeftBar" class="navbar-left" slot="left">
				<icon name="bars" scale=1.2></icon>
			</span>

			<div class="navbar-right" slot="right" v-show="type=='list'">
				<span><icon name="bell-o"></icon></span>
				<span><icon name="ellipsis-v"></icon></span>	
			</div>
<!-- 
			<div class="navbar-right-theme" slot="right" v-show="type=='theme'">
				<icon name="plus-circle" scale=1.2></icon>
			</div> -->

		</TopHeader>

		<!-- <LeftBar></LeftBar> -->
		<div class="main">
			<TopImgBox :sliderList="sliderList"></TopImgBox>
			<List :list="homeDataList"></List>
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
	import moment from 'moment'
	const today=moment().format('YYYYMMDD')
	export default{
		created:function(){
		    //this.getNews()
		    console.log('home created')
		    this.$store.dispatch({//获取当天列表的数据
		    	type:"getHomeListToday"
		    })
		    document.body.scrollTop=this.$store.state.prevScrollTop+"px"
		},
	/*	beforeRouteLeave(to,from,next){
			console.log('beforeEnter',to,from)
			this.$store.state.prevScrollTop=document.body.scrollTop
			next()
		},*/
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
			type(){
				return this.$store.state.topBar.type
			},
			homeDataList(){
				//return this.$store.state.home.homeList
				return this.$store.getters.homeListTillDay
			},
			sliderList(){
				if(!this.$store.state.home.homeList[0]){
					return []
				}
				return this.$store.state.home.homeList[0].top_stories || []
			},
			themeTypes(){
				return this.$store.state.theme.themeTypes
			}
		}
	}
</script>

<style>
	
</style>