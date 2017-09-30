<template>
	<div class="list-box">
			<router-link to="/editors" class="list-title">
				<h3>主编</h3>
				<img v-for="item in newList.editors" :src="item.avatar.replace('http:','https:')"></img>
			</router-link>

			<ul>
				<li v-for="item in newList.stories">
					<router-link :to="'/detail/'+item.id">
						<span>{{item.title}}</span>
						<img v-if="item.images" v-bind:src="item.images && item.images[0].replace('http:','https:')">
					</router-link>
				</li>
			</ul>	
	</div>
</template>

<script>
	import axios from 'axios'
	import logo from '../assets/logo.png'
	require('es6-promise').polyfill();
	import moment from 'moment'
	export default{
		mounted(){
			console.log('list',this.list)
			//var data=this.list[0]
			//console.log(data.data)
		},
		data(){
			return{
				today:moment().add(0,'days').format('YYYYMMDD'),
				url:logo
			}
		},
		computed:{

			newList(){

				var data={...this.list[0]}
				for(var i=1,item;item=this.list[i++];){
					//anotherList.push.coancat(){...this.list[0].stories,...item.stories}
					//this.list[0].stories

					data.stories=data.stories.concat(item.stories)
				}
				console.log('list',this.list)
				console.log('123456',data)
				return {...data}
			},
			editorList(){
				//return this.$store.state.editorList
			}
		
			
		},
		//props:['list','data'],
		props:['list'],
		components:{
			//logo
		}
	}
</script>

<style>
	a{
		text-decoration: none;
		color: #000;
	}
	.list-box{
		background-color:#eee;
	}
	.list-box .list-title{
	    display: flex;
	    height: 40px;
	    line-height: 40px;
	    padding-left: 20px;
	    align-items: center;
	}
	.list-box .list-title{
		font-weight: normal;
	    color: #333;
       font-size: 16px;
	}
	.list-box .list-title img{
		width: 24px;
	    height: 24px;
	    vertical-align: middle;
	    border-radius: 50%;
	    margin-left: 10px;
	}
	.list-box ul{
		display: flex;
		flex-direction:column;
	}
	.list-box li{
		display: flex;
		padding: 10px;
	    background-color: #fff;
	    margin: 8px;
	}
	.list-box li a{
		display: flex;
		flex:1;
	}
	.list-box span{
		flex:1;
		padding-right: 10px;
	}
	.list-box ul img{
		/*flex:1;*/
		width: 80px;
		height: 80px;
	}
</style>