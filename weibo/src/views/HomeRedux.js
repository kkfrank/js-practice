import list from '../components/Home/PreviewListRedux'
import detail from '../components/Detail/DetailRedux'
import {combineReducers} from 'redux'
const appReducer=(state={},action)=>({
	list:list(state.list,action),
	detail:detail(state.detail,action)
	//list:list
})
export default appReducer

/*export default combineReducers({
	list
})*/