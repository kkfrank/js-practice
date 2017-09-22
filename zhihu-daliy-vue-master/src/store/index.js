import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

import API from '../constants/index.js'

import moduleHome from './moduleHome'
import moduleTheme from './moduleTheme'

Vue.use(Vuex)
const today=moment().format('YYYYMMDD')
const store=new Vuex.Store({
	modules:{
		home:moduleHome,
		theme:moduleTheme
	},
	state:{
		loading:true,
		searchDay:today,//知乎日报查询日期：查询2016年11月18日的消息，应为 20161119
		list:[],//主页面列表数组
		//sliderList:[],//主页面轮播图数组
		fresh:true,
		//homeTodayData:[],
		//homeBeforeData:[],
		//themeListData:[],
		detail:[],
		isLeftBarShow:false,
		topBar:{
			type:"list",//list theme detail
			name:"首页"
		},
		editorList:[]
	},
	getters:{
/*		homeDataList(state){
			console.log('getters',state)
			if(state.fresh){
				return state.homeTodayData//.concat()
			}
			return state.homeTodayData.concat(state.homeBeforeData)
		}	*/
	},
	mutations:{
		setSearchDay(state,day){
			state.searchDay=day
		},
/*		setHomeTodayData(state,data){
			//Vue.set(state.homeTodyaData,[data.date],data)
			//console.log('nnnnnnnnnn',data)
			var arr=[{
					date:data.date,
					data:data
			}]
			state.homeTodayData=arr
		
		},
		setHomeBeforeData(state,data){
			if(!data){
				state.homeBeforeData=[]	
				return
			}
			state.homeBeforeData.push({
				date:data.date,
				data
			})
		},*/
		setHomeData(state,data){
			console.log('store',data.date)
			//state.homeData[data.date]=data
			//var arr=[data]
			//state.homeData=arr
			 Vue.set(state.homeData,[data.date],data)
	/*		state.homeData[today].date=data.date
			state.homeData[today].stories=data.stories
			state.homeData[today].top_stories=data.top_stories*/
		},
		setTopBar(state,{type,name}){
			state.topBar.type=type
			state.topBar.name=name
		},
		hideLeftBar(state){
			state.isLeftBarShow=false
			document.body.style=""
		},
		showLeftBar(state){
			state.isLeftBarShow=true
			document.body.style="overflow:hidden;padding-right:0px;"
		},
/*		setList(state,data){
			state.list=data
		},
		addList(state,data){
			state.list=state.list.concat(data)
		},*/
/*		setSliderList(state,data){
			state.sliderList=data
		},*/
		setDetail(state,data){
			state.detail=data
		},
		setEditorList(state,data){
			state.editorList=data
		},

		scrollBottom(state){

		}
	},
	actions:{
		freshMainList(context){
			context.state.fresh=true
		},
		loadMore(context){
			console.log('load',context.state.loading)
			if(context.state.loading){//正在加载
				console.log('loading......')
				return
			}
			var type=context.state.topBar.type
			const beforeDay=moment(context.state.searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
			const have=context.state.homeBeforeData.some(data=>data.date===beforeDay)
			context.state.fresh=false
			if(have){//
				console.log(beforeDay+"have load before")
				context.commit('setHomeBeforeData',beforeDay)
				return
			}
			if(type==="list"){
				axios.get(API.getNewsByDate(context.state.searchDay))
					.then(data=>{
						//console.log(data)
						//context.commit('addList',data.data.stories)
						context.commit('setHomeBeforeData',data.data)
						
						context.state.searchDay=moment(context.state.searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
						context.state.loading=false
					})
					.catch(err=>{
						context.state.loading=false
					})
				//context.dispatch('getHomeList')
			}else if(type==="theme"){

			}
		},
/*		getHomeListBefore(context){
			context.commit('hideLeftBar')
			axios.get(API.getNewsByDate())

		},*/
/*		getHomeListToday(context){
			context.commit('hideLeftBar')
			context.state.fresh=true
			context.state.searchDay=today
			axios.get(API.latestNews)
				.then(data=>{
					console.log('home',data)
					context.commit('setHomeTodayData',data.data)
					context.commit('setHomeBeforeData',null)
					context.commit('setTopBar',{
						type:"list",
						name:"首页"
					})
					context.state.loading=false
				})
				.catch(err=>{
					context.state.loading=false
				})
		},*/
/*		getThemeList(context,{id}){
			context.commit('hideLeftBar')
			axios.get(API.themesIDList+id)
				.then(data=>{
					console.log('axios',data)
					context.commit('setList',data.data.stories)
					context.commit('setEditorList',data.data.editors)
					context.commit('setSliderList',data.data.background || data.data.top_stories)

					context.commit("setTopBar",{
						type:"theme",
						name:data.data.name
					})
				})
				.catch(err=>{

				})
		}*/
	}
})

export default store