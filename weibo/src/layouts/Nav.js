import React,{Component} from "react"
import {Link,IndexLink} from "react-router"
import './nav.css'
const Nav=()=>{
	return(
		<div>	
			<Link to="/" className="site-title">博客-kk</Link>		
			<nav className="site-nav">
				<IndexLink to="/" activeClassName="active">首页</IndexLink>
				<Link to="/about" activeClassName="active">关于我</Link>
			</nav>
		</div>

	)
}

export default Nav