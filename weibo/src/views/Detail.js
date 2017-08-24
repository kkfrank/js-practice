import React,{Component} from 'react'
import {connect} from 'react-redux'

import Detail from '../components/Detail/Detail'
import {loadDetail} from '../components/Detail/DetailRedux'

const mapStateToProps=(state,props)=>{
	//console.log(state,props)
	return{
		id:props.params.id,//react-router提供
		detail:state.home.detail
	}
}
const mapDispatchToProps=(dispatch)=>({
	loooad:function(id){
		dispatch(loadDetail(id))
	}
})
export default connect(mapStateToProps,mapDispatchToProps)(Detail)