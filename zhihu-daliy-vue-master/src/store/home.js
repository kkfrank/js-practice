import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
//import API from '../constants/index.js'
import API from '../api/index.js'
let today=moment().format('YYYYMMDD')
const homeModule={
	state:{
		homeList:[]
	},
	getters:{
/*		homeListTillDay(state,getters,rootState){
			const searchDay=rootState.searchDay
			var list= state.homeList.filter(data=>{
				return moment(data.date).valueOf() >= moment(searchDay).valueOf()
			})
			if(list.length===0){//当日没有最新新闻
				if(state.homeList.length===0){
					list= []
				}else{
					list=[state.homeList[0]]
				}
			}
			return list
		}*/
	},
	mutations:{
		setHomeList(state,data){
			if(!data){
				//state.homeBeforeData=[]	
				return
			}
			state.homeList.push({
				...data
			})
/*			var time=data.date
			for(var i=0,len=state.homeList.length;i<len;i++){
				var item=state.homeList[i]
				if(item.date===time){//此日期的数据已经存在
					state.homeList[i]=data
					return
				}
			}
			state.homeList.push({
				...data
			})*/
		},
		setHomeLatest(state,data){
			//console.log('lates',data)
			state.homeList=[data]
		}
	},
	actions:{
		getHomeLatest(context){
			//console.log('getHomeLatest------------')
			context.commit('setTopBar',{type:"list",name:"首页"})
			API.getHomeLatest()
				.then(data=>{
					//console.log('getHomeLatest------------ okkkkkkkkkkkk')
					context.commit('setLoading',false)
					context.commit('setHomeLatest',data)
					//context.commit('setScrollTop',data)
					Vue.nextTick(function () {
					 // context.commit('setScrollTop',data)
					})
					setTimeout(()=>{
						
					},1500)
					
					
					//setTimeout(()=>{
					//console.log('prevScrollTop',context.state.prevScrollTop)
					//document.body.scrollTop=context.state.prevScrollTop+"px"
					//},100)
					  
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		},
/*		getHomeListToday(context,getter,rootState){
			let today=moment().format('YYYYMMDD')
			context.commit('hideLeftBar')
			axios.get(API.latestNews)
				.then(data=>{
					if(data.data.date!==today){
						context.commit('setSearchDay',data.date)	
					}else{
						context.commit('setSearchDay',today)	
					}

					context.commit('setHomeList',data.data)
					context.commit('setTopBar',{type:"list",name:"首页"})
					context.commit('setLoading',false)
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		},*/
		freshMainList(context){
			context.commit('hideLeftBar')
			axios.get(API.latestNews)
				.then(data=>{
					console.log('axios',data)
					context.commit('setHomeTodayData',data.data)
					context.commit('setTopBar',{
						type:"list",
						name:"首页"
					})
				})
				.catch(err=>{
					console.error(err)
				})
		}
	}
}

export default homeModule