<template>
	<div>
		<TopHeader title="主编">
			<span slot="left" class="navbar-left" @click="routerBack">
				<icon name="arrow-left"></icon>
			</span>
		</TopHeader>
		<div class="editor-box">
			<!-- <router-link :to="'editor/'+item.id" v-for="item in editorList" :key="item.id" class="editor-item"> -->
			<a  @click.prevent="jumpDetail" v-for="item in editorList" class="editor-item" :data-href="getEditor(item.id)">
				<div><img :src="item.avatar.replace('http:','https:')"/></div>
				<div class="editor-profile">
					<div>{{item.name}}</div>
					<p>{{item.bio}}</p>
				</div>
			</a>
			<!-- </router-link> -->
		</div>
	</div>
</template>

<script>
	import  Api from '../constants/'
	import TopHeader from '../components/TopHeader'
	import axios from 'axios'
	export default{
		methods:{
			jumpDetail(ev){
				console.log(ev.target)
				axios.get(ev.target.getAttribute('data-href'))
					.then(data=>{
						console.log(data)
					})
					.catch(err=>{
						console.log(err)
					})
			},
			getEditor:Api.getEditor,
			routerBack(){
				this.$router.back()
			}
		/*	function(id){
				return getEditor(id)
			}*/
		},
		computed:{
			editorList:function(){
				return this.$store.state.editorList
			}
		},
		components:{
			TopHeader
		}
	}
</script>

<style>
	.editor-box{
		position: absolute;
	    top: 50px;
	    width: 100%;
	}
	.editor-item {
	    display: flex;
        padding: 10px;
    	border-bottom: 1px solid #ddd;
	}
	.editor-item img{
		width: 56px;
	    height: 56px;
	    border-radius: 50%;
	}
	.editor-profile{
		margin-left: 10px;
	}
	.editor-profile div {
	    margin-top: 4px;
	}
	.editor-profile p {
	    margin-top: 10px;
	    font-size: 14px;
	    color: #333;
	}

</style>