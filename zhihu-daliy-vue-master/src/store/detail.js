// import moment from 'moment'
// import Vue from 'vue'
// import axios from 'axios'
//import API from '../constants/index.js'
import API from '../api/index.js'

const detailModule={
	state:{
		content:{
			//body:"",
		},
		extra:{
			comments:"",
			long_comments:"",
			short_comments:"",
			popularity:""
		}
	},
	getters:{

	},
	mutations:{
		setDetail(state,data){
			state.detail=data
		},
		clearDetailAll(state){
			console.log('clear all')
			state.content={}
			state.extra={
				comments:"",
				long_comments:"",
				short_comments:"",
				popularity:""
			}
		}
	},
	actions:{
		getDetail(context,{id}){
			API.getNewsDetail(id)
				.then(data=>{
					context.state.content=data//.data
				})
				.catch(err=>{
					console.error(err)
				})
		},
		getDetailExtra(context,{id}){
			API.getDetailExtra(id)
				.then(data=>{
					context.state.extra=data//.data
				})
				.catch(err=>{
					console.err(err)
				})
		}
	}
}
export default detailModule