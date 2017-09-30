import axios from 'axios'
import moment from 'moment'

import API from '../constants/index.js'

let today=moment().format('YYYYMMDD')
const moduleTheme={
	state:{
		//searchDay:today,
		themeTypes:[],
		themeList:{
			2:[],//开始游戏
			3:[],//电影日报
			4:[],//设计日报
			5:[],//大公司日报
			6:[],//财经日报
			7:[],//音乐日报
			9:[],//动漫日报
			8:[],//体育日报
			10:[],//互联网安全
			11:[],//不许无聊
			12:[],//用户推荐日报
			13:[]//日常心理学
		}
	},
	getters:{

	},
	mutations:{
		setThemeTypes(state,data){
			state.themeTypes=data
		},
		setThemeList(state,{type,data,fresh}){
			//console.log('setThemeList',type,data)
			//console.log(state.themeList)
			if(fresh){//刷新
				state.themeList[type]=[{...data}]
			}else{
				state.themeList[type].push({...data})	
			}
		}
	},
	actions:{
		getThemesTypes(context){
			axios.get(API.themes)
				.then(data=>{
					context.commit('setThemeTypes',data.data.others)
				})
				.catch(err=>{
					console.error(err)
				})
		},
		getThemeListNow(context,{id},rootState,rootGetters){
			context.commit('hideLeftBar')
			today=moment().format('YYYYMMDD')
			context.commit('setLoading',true)
			context.commit('setSearchDay',today)

			axios.get(API.themesIDList+id)
				.then(data=>{
					//console.log('theme',data)
					context.commit('setThemeList',{
						type:id,
						data:data.data,
						fresh:true
						//time:today
					})
					//context.commit('setList',data.data.stories)
					//context.commit('setEditorList',data.data.editors)
					//context.commit('setSliderList',data.data.background || data.data.top_stories)
					context.commit("setTopBar",{
						type:"theme",
						name:data.data.name
					})
					context.commit('setLoading',false)
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		}
	}
}
export default moduleTheme