<template>
	<div class="leftbar-box" @click="hideLeftBar" v-show="isLeftBarShow">
		<div class="leftbar-inner">

			<div class="leftbar-top">
				<div class="leftbar-profile">
					<img :src="logo">
					<span>{{name}}</span>
				</div>
				<div class="leftbar-btns">
					<icon name="star" scale=1 class="btns-icon-star"></icon> 
					<span>我的收藏</span>

					<icon name="download" scale=1 class="btns-icon-download"></icon> 
					<span>离线下载</span>
				</div>
			</div>
			

			<div class="leftbar-bottom">
			<!-- 	<h2 @click="showHome">	</h2> -->
				<a class="jump-home" @click="jumpHome">
				<!-- <router-link :to="homePath"  class="jump-home" @click="jumpHome"> -->
					<icon name="home" scale=1.3 class="navbar-icon-home"></icon> 
					<span>首页</span>
				<!-- </router-link> -->
				</a>
				<ul @click="changeTheme">
					<li v-for="item in list">
						<router-link :to="'/theme/'+item.id" class="leftbar-link" :data-id="item.id">
							<span>{{item.name}}</span>
							<i class="leftbar-list-icon">+</i>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import API from '../constants/index.js'
	import Icon from 'vue-awesome/components/Icon.vue'

	import logo from '../assets/logo.png'
	export default{
		// props:['list'],
		data(){
			return{
				homePath:"/",
				name:"台上问问",
				logo,
				//isLeftbarShow:true
			}
		},
		components:{
			Icon
		},
		computed:{
		/*	homePath:function(){
				return '/'
			},*/
			isLeftBarShow:function(){
				return this.$store.state.isLeftBarShow
			},
			list:function(){
				return this.$store.state.theme.themeTypes
			}
		},
		methods:{
			jumpHome(){
			    this.$store.dispatch({//获取当天列表的数据
			    	type:"getHomeListToday"
			    })
				console.log(123)
				this.$router.push({path:"/"})
				//this.$router.go(0)
			},
			hideLeftBar(ev){
				console.log(ev.target)
				var clsName=ev.target.className
				if(ev.target.tagName==="DIV" && clsName && clsName.indexOf("leftbar-box")>=0){
					//this.isLeftbarShow=false
					this.$store.commit('hideLeftBar')
				}
			},
			showHome(ev){
				this.$store.dispatch('getHomeList')
				//this.$store.commit('toggleLeftBar')
			},
			changeTheme(ev){
				if(ev.target.className.indexOf('leftbar-list-icon')>=0){//关注
					console.log('返回，关注')
					return false
				}
				var id="",target=ev.target
				if(target.tagName==="SPAN"){
					target=target.parentNode
				}
				id=target.getAttribute('data-id')

			    this.$store.dispatch({
			    	type:"getThemeListNow",
			    	id
			    })
			   // this.$store.commit('toggleLeftBar')
			}
		}
	}
</script>

<style>
	.leftbar-box{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/*background-color: #00a2ea;*/
	    background-color: rgba(0,0,0,0.5);
    	z-index: 10;
	}
	.leftbar-inner{
		width: 80%;
	    height: 100%;
	    background-color: #fff;
        overflow-y: auto;
	}
	.leftbar-top{
		color:#fff;
		background-color: #00a2ea;
	}
	.leftbar-profile{
	/*	height: 60px;
		line-height: 60px;*/
		padding: 10px 20px;
	}
	.leftbar-profile img{
	    width: 30px;
	    height: 30px;
	    border-radius: 50%;
	    background-color: #eee;
	    vertical-align: middle;
	}
	.leftbar-btns{
		padding: 10px 0 10px 30px;
		font-size: 14px;
	}
	.leftbar-btns span{
	    margin-left: 16px;
	    margin-right: 60px;
	    vertical-align: 3px;
	}
	.leftbar-bottom ul{
	   /* padding: 0 60px 0 24px;*/
	}
	.leftbar-bottom .jump-home{
	    display: block;
		padding-left:30px; 
		background-color: #eee;
	    font-size: 16px;
	    height: 36px;
	    line-height: 36px;
	    color: #00a2ea;
	}
	.leftbar-bottom .jump-home span{
		margin-left: 16px;
	    font-weight: normal;
	}
	.leftbar-bottom li span{
		margin-left: 24px;
	}
	.leftbar-bottom li{
		height: 36px;
	    line-height: 36px;
	}
	.leftbar-bottom .navbar-icon-home{
		vertical-align: middle;
	}
	.leftbar-link{
		display: block;
	}
	.leftbar-list-icon{
		float: right;
	    font-size: 24px;
	    font-style: normal;
	    color: #666;
        margin-right: 60px;
	}

</style>