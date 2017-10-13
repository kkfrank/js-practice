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
	import TopImgBox from '../components/TopImgBox.vue'
	import List from '../components/List.vue'
	export default{
		created:function(){
		/*	console.log('homde created',this.$store.state.prevScrollTop)
		    this.$store.dispatch({//获取当天列表的数据
		    	type:"getHomeLatest"
		    })*/
		   // document.body.scrollTop=this.$store.state.prevScrollTop+"px"
		   	this.$store.commit('setTopBar',{type:"list",name:"首页"})//从详情页进来，需要修改title
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				if(!from.path.match(/^\/detail/) || vm.homeDataList.length===0){
					vm.$store.dispatch({//获取当天列表的数据
		    			type:"getHomeLatest"
				    })
				}else{//从详情页面返回
					vm.$store.commit('setScrollTop')	
				}
			})
		},
	 	methods:{
			showLeftBar(){
				this.$store.commit('showLeftBar')
			},
		},
		components:{
			TopHeader,
			//LeftBar,
			TopImgBox,
			List
		},
		computed:{
			type(){
				return this.$store.state.topBar.type
			},
			homeDataList(){
				return this.$store.state.home.homeList
				//return this.$store.getters.homeListTillDay
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