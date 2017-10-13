import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

//import API from '../constants/index.js'
import API from '../api/index.js'
import home from './home'
import theme from './theme'
import detail from './detail'

Vue.use(Vuex)
const today=moment().format('YYYYMMDD')
function haveItem(list,date){
	for(var i=0;i<list.length;i++){
		if(list[i].date===date){
			return true
		}
	}
	return false
}
const store=new Vuex.Store({
	modules:{
		home,
		theme,
		detail
	},
	state:{
		loading:false,
		searchDay:today,//知乎日报查询日期：查询2016年11月18日的消息，应为 20161119
		fresh:true,
		isLeftBarShow:false,
		topBar:{
			type:"",//list theme detail
			name:""
		},
		prevScrollTop:0,//保存列表进入详情页面之前的scrollTop值
		editorList:[]
	},
	getters:{
	  
	},
	mutations:{
		setScrollTop(state){
			//console.log('prevScrollTop11111',state.prevScrollTop)
			document.body.scrollTop=state.prevScrollTop
		},
		setSearchDay(state,day){
			state.searchDay=day
		},
		setLoading(state,loading){
			state.loading=loading
		},
		//setTopBar(state,{type,name}){
		setTopBar(state,data){
			state.topBar.type=data.type
			data.name && (state.topBar.name=data.name)
			//Vue.set(state.topBar,'type',type)
		},
		hideLeftBar(state){
			state.isLeftBarShow=false
			document.body.style=""
		},
		showLeftBar(state){
			state.isLeftBarShow=true
			document.body.style="overflow:hidden;padding-right:0px;"
		},
		setEditorList(state,data){
			state.editorList=data
		}
	},
	actions:{
		freshMainList(context){
			context.state.fresh=true
		},
		loadMore(context,{id}){//下拉加载更多
			if(context.state.loading){//正在加载
				console.log('loading......')
				return
			}
			context.commit('setLoading',true)
			var type=context.state.topBar.type
			var url="",list=[];
			if(type==="list"){//主页加载更多
				var list=context.state.home.homeList
				var beforeDate=list[list.length-1].date//知乎api查询日期需+1
				API.getNewsByDate(beforeDate)
					.then(data=>{
						context.commit('setLoading',false)
						context.commit('setHomeList',data.data)
					})
					.catch(err=>{
						context.commit('setLoading',false)
					})
			}else{
				var list=context.state.theme.themeList[id]
			    var stories=list[list.length-1].stories
			    var beforeId=stories[stories.length-1].id
			    API.getThemeListByDate(id,beforeId)
					.then(data=>{
						context.commit('setThemeList',{
							type:id,
							data:data.data
						})	
						context.commit('setLoading',false)
					})
					.catch(err=>{
						console.error('error',err)
						context.commit('setLoading',false)
					})
			}
			/*var	searchDay=context.state.searchDay
			if(type==="list"){
				list=context.state.home.homeList
				var url=API.getNewsByDate(searchDay)
			}else{
				list=context.state.theme.themeList[id]
				var stories=list[list.length-1].stories
				if(stories.length===0){
					console.log('没数据啦')
					context.commit('setLoading',false)
					return
				}
				var beforeId=stories[stories.length-1].id
				url=API.getThemeListByDate(id,beforeId)
			}
			context.state.searchDay=moment(searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
			if(haveItem(list,context.state.searchDay)){//已经存在
				console.log('已经存在')
				return
			}
			axios.get(url)
				.then(data=>{
					if(type==="list"){
						context.commit('setHomeList',data.data)
					}else{
						context.commit('setThemeList',{
							type:id,
							data:data.data
						})	
					}
					context.commit('setLoading',false)
				})
				.catch(err=>{
					console.error('error',err)
					context.commit('setLoading',false)
				})*/
			
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