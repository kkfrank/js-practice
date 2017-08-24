import React,{Component} from "react"
import {Link} from 'react-router'
import "./Preview.css"
const Preview=({id,title,date,description,push})=>{
	function handleNavigate(e){
		//e.preventDefault()
		push(id)
	}
	return(
		<article className>
			<h2 className="title">
				<Link to={`/detail/${id}`} onClick={handleNavigate}>{title}</Link>
			</h2>
			<span className="date">{date}</span>
			<p className="desc">{description}</p>
			{/*<div>i am中文，哐哐哐是床前明月光疑是地上霜</div>*/}
		</article>
	)
}

export default Preview