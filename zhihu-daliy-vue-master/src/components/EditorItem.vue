<template>
	<div>
		<TopHeader title="主编资料">
			<span class="navbar-left" @click="routerBack" slot="left"><icon name="arrow-left"></icon></span>
		</TopHeader>
		<div>

		</div>

	</div>
</template>

<script>
	import TopHeader from '../components/TopHeader'
	export default{
		created:function(){
		    //this.getNews()
		    this.$store.dispatch({
		    	type:"getHomeList"
		    })
		},
	 	methods:{
			showLeftBar(){
				this.$store.commit('toggleLeftBar')
			},
		},
		components:{
			TopHeader,
		},
		computed:{
			name(){
				console.log(this.$store.state.topBar.name)
				return this.$store.state.topBar.name
			},
			list:function(){
				return this.$store.state.list
			},
			sliderList(){
				return this.$store.state.sliderList
			}
		}
	}
</script>

<style>
	
</style>