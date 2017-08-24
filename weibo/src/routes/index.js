import React,{Component} from 'react'
import {Router,Route,hashHistory,browserHistory,IndexRoute} from "react-router"
import {syncHistoryWithStore} from 'react-router-redux'

import Frame from '../layouts/Frame'
import Home from "../views/Home"
import Detail from "../views/Detail"
import About from '../views/About'
import store from '../redux/configreStore'

const history=syncHistoryWithStore(browserHistory,store)
export default ()=>{
	return(
		<Router history={history}>
			<Route path="/" component={Frame}>
				<IndexRoute component={Home} />
				<Route path="/detail/:id" component={Detail}/>
				<Route path="/about" component={About}/>
			</Route>
		</Router>
	)
}