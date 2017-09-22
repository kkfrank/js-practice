import moment from 'moment'
import axios from 'axios'
import API from '../constants/index.js'
let today=moment().format('YYYYMMDD')
const homeModule={
	state:{
		homeTodayData:[],
		homeBeforeData:[],
	},
	getters:{
		homeDataList(state){
			console.log('getters',state)
			if(state.fresh){
				return state.homeTodayData//.concat()
			}
			return state.homeTodayData.concat(state.homeBeforeData)
		}	
	},
	mutations:{
		setHomeTodayData(state,data){
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
		},

	},
	actions:{
		getHomeListToday(context){
			context.commit('hideLeftBar')
			context.state.fresh=true
			context.state.searchDay=today
			axios.get(API.latestNews)
				.then(data=>{
					console.log('home',data)
					context.commit('setHomeTodayData',data.data)
					context.commit('setHomeBeforeData',null)
					context.commit('setTopBar',{type:"list",name:"首页"})
					context.state.loading=false
				})
				.catch(err=>{
					context.state.loading=false
				})
		},
		getHomeListBefore(context){
			context.commit('hideLeftBar')
			axios.get(API.getNewsByDate())

		},
		freshMainList(context){
			context.commit('hideLeftBar')
			axios.get(API.latestNews)
				.then(data=>{
					console.log('axios',data)
					context.commit('setHomeTodayData',data.data)
					/*context.commit('setList',data.data.stories)
					context.commit('setSliderList',data.data.background || data.data.top_stories)*/
					context.commit('setTopBar',{
						type:"list",
						name:"首页"
					})
				})
				.catch(err=>{

				})
		},
		loadMore(context){
			var type=context.state.topBar.type
			if(type==="list"){
				axios.get(API.getNewsByDate(context.state.listDay))
					.then(data=>{
						console.log(data)
						//context.commit('addList',data.data.stories)
						context.commit('setHomeBeforeData',data.data)

						context.state.listDay=moment(context.state.listDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
					})
					.catch(err=>{

					})
				//context.dispatch('getHomeList')
			}else if(type==="theme"){

			}
		}
		
	},
}

export default homeModule