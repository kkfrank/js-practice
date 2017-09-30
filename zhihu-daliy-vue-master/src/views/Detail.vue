<template>
	<div>
		<TopHeader>
			<span slot="left" class="navbar-left" @click="routerBack">
				<icon name="arrow-left"></icon>
			</span>
			<div slot="right" class="navbar-right-detail">
				<span class="navbar-icon"><icon name="share-alt"></icon> </span>
				<span class="navbar-icon"><icon name="star"></icon> </span>	
				<span class="navbar-icon"><icon name="commenting"></icon>{{extra.comments}}</span>
				<span class="navbar-icon"><icon name="thumbs-up"></icon>{{extra.popularity}}</span>	
			</div>
		</TopHeader>

		<div class="detial-box">
			<div v-if="detail.image" class="detail-img-box" :style="{backgroundImage:'url('+detail.image+')'}">
				<!-- <img :src="url" alt="picture"> -->
				<div class="detail-overlay">
					<h2>{{detail.title}}</h2>
					<span>{{detail.image_source}}</span>
				</div>
			</div>
			<div v-html='detail.body && detail.body.replace(/http:/g,"https:")' class="detail-content-box"></div>
		</div>
	</div>
	
</template>

<script>
	import axios from 'axios'
	import TopHeader from '../components/TopHeader'
	import API from '../constants/index.js'
	import {mapState} from 'vuex'
	export default{
		/*data(){
		
		},*/
		computed:mapState({
			detail:state=>state.detail.content,
			extra:state=>state.detail.extra
		}),
	/*	computed:{
			detail:function(){
				return this.$store.state.detail.content
			},
			extra:function(){
				return this.$store.state.detail.extra
			}
		},*/
		methods:{
			routerBack(){
				this.$router.back()
				this.$store.commit('clearDetailAll')
			}
		},
		created:function(){
			const id=this.$route.params.id
			this.$store.dispatch({
				type:"getDetail",
				id
			}),
			this.$store.dispatch({
				type:"getDetailExtra",
				id
			})
			//this.prevScrollTop=document.body.scrollTop
			console.log('before',document.body.scrollTop)
			this.$store.state.prevScrollTop=document.body.scrollTop
			document.body.scrollTop=0
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
	.detail-overlay{
	    width: 100%;
    	height: 100%;
		background: rgba(0,0,0,0.3);
	}
	.detail-img-box h2{
	    position: absolute;
	    color: #eee;
	    font-size: 18px;
	    bottom: 28px;
	    padding: 0 10px;
	    font-size: 20px;
	    font-weight: normal;
	}
	.detail-img-box span{
		position: absolute;
		right: 20px;
		bottom:10px;
		color: #eee;
	    font-size: 14px;
	}
	.detail-content-box{
		background-color: #f5f5f5;
		padding: 18px;
	}
	.detail-content-box .answer .meta{
	    padding: 20px 0;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.detail-content-box .avatar{
	    vertical-align: -7px;
	    height: 26px;
	    margin-right: 6px;
	}
	.detail-content-box .content p,.detail-content-box .content hr,
	.detail-content-box .content blockquote,.detail-content-box .headline{
		margin-bottom: 20px;
	}
	.detail-content-box blockquote{
		border-left: 2px solid #63bbe2;
   	 	padding-left: 8px;
	}
	.detail-content-box a{
	    color: #01a3ea;
	}
	.detail-content-box .heading{
		color: #999;
	    margin-bottom: 6px;
	}
	.detail-content-box .heading-content{
		color: #333;
	}
	.detail-content-box .view-more{
	    background-color: #eee;
	    padding: 4px 0;
	    text-align: center;
	}
	.detail-content-box .view-more a{
 		color: #999;
	}
	.detail-content-box  .question-title{
		font-size: 1.2em
	}
	.detail-content-box .content-image{
		width: 100%;
	}
</style>