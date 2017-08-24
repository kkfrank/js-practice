import  'whatwg-fetch'

const LOAD_DETAIL="LOAD_DETAIL"
const LOAD_DETAIL_SUCCESS="LOAD_DETAIL_SUCCESS"
const LOAD_DETAIL_ERROR="LOAD_DETAIL_ERROR"

const initState={
	loading:true,
	error:null,
	content:""
}
const loadDetailError=(error)=>({
	type:LOAD_DETAIL_ERROR,
	error:error.toString()
})
const loadDetailSuccess=(content)=>({
	type:LOAD_DETAIL_SUCCESS,
	payload:{
		content:content
	}
})
export const loadDetail=(id)=>{
	return (dispatch)=>{
		fetch(`/api/Detail_${id}.json`)
			.then(res=>res.json())
			.then(data=>{
				console.log('data',data)
				dispatch(loadDetailSuccess(data.content))
			})
			.catch((error)=>{
				dispatch(loadDetailError(error))
			})
	}
}
export default function detail(state=initState,action){
	switch(action.type){
		case LOAD_DETAIL:
			return{
				...state,
				loading:true,
			}
		case LOAD_DETAIL_SUCCESS:
			return{
				...state,
				loading:false,
				error:null,
				content:action.payload.content
			}
		case LOAD_DETAIL_ERROR:
			return{
				...state,
				error:action.error,
			}
		default:
			return state
	}
}