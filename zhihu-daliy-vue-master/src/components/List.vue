<template>
	<div class="list-box">
		<div v-for="data in newList">
			<h3 v-if="type==='list'" class="list-title">
				{{data.date===today ? "今日新闻" :data.date}}
			</h3>
			<router-link v-else to="/editors" class="list-title">
				<h3>主编</h3>
				<img v-for="item in data.editors" :src="item.avatar.replace('http:','https:')"></img>
			</router-link>
	
			<ul>
				<li v-for="item in data.stories">
					<router-link :to="'/detail/'+item.id">
						<span>{{item.title}}</span>
						<img v-if="item.images" v-bind:src="item.images && item.images[0].replace('http:','https:')">
					</router-link>
				</li>
			</ul>	
		</div>
	</div>
</template>

<script>
	import logo from '../assets/logo.png'
	require('es6-promise').polyfill();
	import moment from 'moment'
	export default{
		mounted(){
			//console.log('list',this.list)
			//var data=this.list[0]
			//console.log(data.data)
		},
		data(){
			return{
				today:moment().add(0,'days').format('YYYYMMDD'),
				url:logo,
				stories:function(){
					if (true) {

					}
				}
				//list:[]
			}
		},
		computed:{
			type:function(){
				return this.$store.state.topBar.type
			},
			newList(){
				if(this.type==='list'){
					return this.list
				}
				for(var i=1,item=this.list[i++];item;i++){
					//this.list[0].stories={...this.list[0].stories,...item.stories}
					//this.list[0].stories.concat(item.stories)
				}
				//console.log('123456',this.list)
				return this.list[0]
			},
			editorList(){
				return this.$store.state.editorList
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