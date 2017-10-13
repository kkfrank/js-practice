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
	import List from '../components/themeList.vue'
	
	export default{
		created:function(){
		/*    this.$store.dispatch({
		    	type:"getThemeListNow",
		    	id:this.$route.params.id
		    })*/
	    	this.$store.commit('setTopBar',{type:"theme"})
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				if(!from.path.match(/^\/detail/) || vm.themeList.length===0){
					//console.log('vm.themeList',vm.themeList)
					vm.$store.dispatch({//获取当天列表的数据
		    			type:"getThemeListNow",
	    				id:vm.$route.params.id
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
			LeftBar,
			TopImgBox,
			List
		},
		computed:{
			themeList(){
				const id=this.$route.params.id
				return this.$store.state.theme.themeList[id]
			},
			name(){
				//console.log(this.$store.state.topBar.name)
				return this.$store.state.topBar.name
			},
			sliderList(){
				const id=this.$route.params.id
				return this.$store.state.theme.themeList[id]
			}
		}
	}
</script>

<style>
	
</style>