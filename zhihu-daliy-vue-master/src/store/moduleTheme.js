import axios from 'axios'
import moment from 'moment'

import API from '../constants/index.js'

let today=moment().format('YYYYMMDD')
const moduleTheme={
	state:{
		searchDay:today,
		themeList:{
			11:[],//不许无聊
			12:[],//用户推荐日报
			13:[]//日常心理学
		}
	},
	getters:{},
	mutations:{
		setThemeList(state,{type,data}){
			console.log('setThemeList',type,data)
			console.log(state.themeList)
			if(state.searchDay===today){//刷新
				Vue.set(state.themeList[type],'0',{
						data
				})
			/*	state.themeList[type][0]={
					//date:time,
					data:{//和主页面的数据结构保持一致，方便list重用
						data
					}
				}*/
			/*	state.themeList[type].push({
					//date:time,
					data:{//和主页面的数据结构保持一致，方便list重用
						data
					}
				})*/
		/*		state.themeList[type].splice(0,1)
				state.themeList[type].unshift({
					data:{//和主页面的数据结构保持一致，方便list重用
						data
					}
				})*/
			}else{
				state.themeList[type].push({
					//date:time,
					data	
				})	
			}
		}
	},
	actions:{
		getThemeListNow(context,{id},rootState,rootGetters){
			context.commit('hideLeftBar')
			today=moment().format('YYYYMMDD')
			context.commit('setSearchDay',today)

			axios.get(API.themesIDList+id)
				.then(data=>{
					console.log('theme',data)
					context.commit('setThemeList',{
						type:id,
						data:data.data,
						//time:today
					})
					//context.commit('setList',data.data.stories)
					//context.commit('setEditorList',data.data.editors)
					//context.commit('setSliderList',data.data.background || data.data.top_stories)
					context.commit("setTopBar",{
						type:"theme",
						name:data.data.name
					})
				})
				.catch(err=>{

				})
		}
	}
}
export default moduleTheme