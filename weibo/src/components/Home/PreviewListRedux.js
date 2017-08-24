import "whatwg-fetch"
const LOAD_ARTICLES="LOAD_ARTICLES"
const LOAD_ARTICLES_SUCCESS="LOAD_ARTICLES_SUCCESS"
const LOAD_ARTICLES_ERROR="LOAD_ARTICLES_ERROR"
const initState={
	loading:true,
	error:false,
	articleList:[]
}
export function loadArticles(){
	return function(dispatch){
		dispatch({type:LOAD_ARTICLES})
		fetch('/api/articles.json')
			.then(res=>res.json())
			.then(data=>{
				dispatch(loadArticlesSuccess(data))
			}).catch(error=>{
				dispatch(loadArticlesError(error))
			})

	}
}
function loadArticlesSuccess(list){
	return{
		type:LOAD_ARTICLES_SUCCESS,
		payload:{
			articleList:list
		}
	}
}
function loadArticlesError(error){
	return{
		type:LOAD_ARTICLES_ERROR,
		error
	}
}
function previewList(state=initState,action){
	console.log(`${action.type},prevState`,state)
	switch(action.type){
		case LOAD_ARTICLES:
			return{
				...state,
				loading:true,
				error:false,
			}
		case LOAD_ARTICLES_SUCCESS:
			return{
				...state,
				loading:false,
				error:false,
				articleList:action.payload.articleList
			}
		case LOAD_ARTICLES_ERROR:
				return{
				...state,
				loading:false,
				error:action.error.toString(),
			}
		default:
			return state
	}
}

export default previewList