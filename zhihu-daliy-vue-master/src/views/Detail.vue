<template>
	<div>
		<TopHeader>
			<span slot="left" class="navbar-left" @click="routerBack">
				<icon name="arrow-left"></icon>
			</span>
			<div slot="right" class="navbar-right-detail">
				<span class="navbar-icon"><icon name="share-alt"></icon> </span>
				<span class="navbar-icon"><icon name="star"></icon> </span>	
				<span class="navbar-icon"><icon name="commenting"></icon> </span>
				<span class="navbar-icon"><icon name="thumbs-up"></icon> </span>	
			</div>
		</TopHeader>

		<div class="detial-box">
			<div class="detail-img-box" :style="{backgroundImage:'url('+detail.image+')'}">
				<!-- <img :src="url" alt="picture"> -->
				<h2>{{detail.title}}</h2>
				<span>{{detail.image_source}}</span>
			</div>
			<div v-html='detail.body'></div>
		</div>
	</div>

	
</template>

<script>
	import axios from 'axios'
	import TopHeader from '../components/TopHeader'
	export default{
		data(){
			return{
				/*detailHtml:"",
				url:"",
				imgSource:"",
				title:""*/
				detail:{}
			}
		},
		methods:{
			routerBack(){
				this.$router.back()
			},
			getDetail(){
				const id=this.$route.params.id
				axios.get(`http://127.0.0.1:9001/api/4/news/${id}`)
					.then(data=>{
						console.log(data)
						this.detail=data.data
						/*this.detailHtml=data.data.body
						this.url=data.data.image
						this.imgSource=data.data.image_source
						this.title=data.data.title*/
					})
					.catch(err=>{
						console.log(err)
					})
			}
		},
		created:function(){
			this.getDetail()
		},
		components:{
			TopHeader
		}

	}
</script>

<style>
	.detail-img-box{
		position: relative;
	    height: 230px;
    	width: 100%;
	    background-size: cover;
    	background-repeat: no-repeat;
    	background-position: 0 -86px;
    	margin-top: 50px;
	}
	.detail-img-box h2{
		position: absolute;
	    color: #fff;
	    font-size: 18px;
	    bottom: 28px;
	    padding: 0 10px;
	}
	.detail-img-box span{
		position: absolute;
		right: 20px;
		bottom:10px;
		color: #eee;
	    font-size: 14px;
	}
</style>