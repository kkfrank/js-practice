import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import Routers from './routes/'
import {Provider} from "react-redux"
import store from './redux/configreStore'
import DevTools from './redux/DevTools';
ReactDOM.render(
	<Provider store={store}>
		<div>
			<Routers/>
			<DevTools/>
		</div>
	</Provider>,
	document.getElementById('root')
)