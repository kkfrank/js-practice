import React,{Component} from "react"
import Nav from "./Nav"

const Frame=({children})=>{
	return(
		<div className="frame">
			<div className="header">
				<Nav />
			</div>

			<div className="container">
				{children}
			</div>
		</div>
	)
}

export default Frame