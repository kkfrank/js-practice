//https://news-at.zhihu.com/api/4/news/latest

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

export default{
	latestNews,
	themes,
	themesIDList,
	getRecommenders,
	getEditor,
	getNewsByDate
}

