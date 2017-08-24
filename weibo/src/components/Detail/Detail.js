import React,{Component} from 'react'
class Detail extends Component{
	componentDidMount(){
		this.props.loooad(this.props.id)
	}
	render(){
		const{loading,error,content}=this.props.detail
		if(loading){
			return(
				<div>loading....</div>
			)
		}
		if(error){
			return(
				<div>
					<div>error{ error}</div>
				</div>
			)
		}
		return(
			<div>
				{content}
			</div>
		)
	}
}
export default Detail
