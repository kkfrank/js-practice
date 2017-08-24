import {createStore,applyMiddleware,combineReducers,compose} from 'redux'
// import {routerReducer} from "react-router-redux"
import thunkMiddleware from 'redux-thunk'
import {routerReducer,routerMiddleware} from 'react-router-redux'
import {browserMiddleware,hashHistory,browserHistory} from 'react-router'
//import appreducer from '../views/HomeRedux'
import appreducer from './reducers'
import DevTools from './DevTools';
//const store=createStore(rootReducre,applyMiddleware(thunkMiddleware))

const finalReducer=Object.assign({},appreducer,{
		routing:routerReducer
	})
const store=createStore(
	combineReducers({
		...appreducer,
		routing:routerReducer
	}),
	{},
	compose(
		//applyMiddleware(thunkMiddleware,routerMiddleware(browserHistory)),
		applyMiddleware(thunkMiddleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 		//DevTools.instrument()
	)
	//combineReducers(finalReducer),
)
export default store

