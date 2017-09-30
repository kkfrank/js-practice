import axios from 'axios'
// return request(`/api/users?_page=${page}&_limit=${PAGE_SIZE}`);

//https://news-at.zhihu.com/api/4/news/latest
//`http://127.0.0.1:9001/api/4/news/${id}`
const BaseUrl="http://127.0.0.1:9001/api/4"
const latestNews=BaseUrl+'/news/latest'
const newsDetail=BaseUrl+'/news/'
//知乎日报的生日为 2013 年 5 月 19 日，若 before 后数字小于 20130520 ，只会接收到空消息
//若果需要查询 11 月 18 日的消息，before 后的数字应为 20131119
const beforNews=BaseUrl+'/news/before/' 
const themes=BaseUrl+'/themes'
const themesIDList=BaseUrl+'/theme/'

const getRecommenders=id=>BaseUrl+`/story/${id}/recommenders`
const getEditor=id=>BaseUrl+`/editor/${id}/profile-page/android`
const getNewsByDate=date=>BaseUrl+`/news/before/${date}`  //date:20131119
const getThemeListByDate=(themeId,beforeId)=>BaseUrl+`/theme/${themeId}/before/${beforeId}`


export default{
	getNewsDetail(id){
		return new Promise((resolve,reject)=>{
			axios.get(BaseUrl+'/news/'+id)
				.then(data=>{
					resolve(data.data)
				})
				.catch(err=>{
					reject(err)
				})
		})
	},
	getDetailExtra(id){
		return new Promise((resolve,reject)=>{
			axios.get(BaseUrl+'/story-extra/'+id)
				.then(data=>{
					resolve(data.data)
				})
				.catch(err=>{
					reject(err)
				})
		})

	}
}