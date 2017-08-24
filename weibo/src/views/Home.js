import React,{Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import PreviewList from "../components/Home/PreviewList"
import * as listActions from "../components/Home/PreviewListRedux"
import {push} from "react-router-redux"
import "./Home.css"
//import loadArticles from "../components/Home/PreviewListRedux"
class Home extends Component{
	render(){
		return(
			<div className="home">
				<h1>博客列表</h1>
				<PreviewList 
					{...this.props.list}
					{...this.props.listActions}
					push={this.props.push}
				/>
				 {/*<Link to="detail/123" activeStyle={{color:"red"}}>detail</Link>*/}
			</div>
			
		)
	}
}
const mapStateToProps=(state)=>{
	return{
		list:state.home.list
	}
}
const mapDispatchToProps=(dispath)=>({
	listActions:bindActionCreators(listActions,dispath),
	push:bindActionCreators(push,dispath)
})
export default connect(mapStateToProps,mapDispatchToProps)(Home)