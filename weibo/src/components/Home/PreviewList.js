import React,{Component} from "react"
import Preview from "./Preview"
/*const PreviewList=({articleList})=>{
	return(
		articleList.map(article=>{
			return <Preview {...article} key={article.id}/>
		})
	)
}*/
class PreviewList extends Component{
	componentDidMount(){
		this.props.loadArticles()
	}
	render(){
		const {loading,error,articleList,push}=this.props
		if(error){
			return <p>something wrong {error}</p>
		}
		if(loading){
			return <p>loading....</p>
		}
		return(
			<div>
		 		{
				 	articleList.map(article=>{
						return <Preview {...article} key={article.id} push={push}/>
					})
				}
			</div>
		)
	}
}
export default PreviewList