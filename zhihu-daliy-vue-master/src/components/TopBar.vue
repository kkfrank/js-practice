<template>
	<header class="navbar">
		<span @click="showLeftBar" class="navbar-icon-menu" v-show="type==='list'|| type==='theme' "><icon name="bars" scale=1.2></icon></span>
		<span v-show="type!=='list' && type!=='theme'" class="navbar-icon" @click="routerBack"><icon name="arrow-left"></icon></span>
		<h1 class="navbar-span-title">{{name}}</h1>
		
		<div v-show="type==='list'" class="navbar-right">
			<span><icon name="bell-o"></icon> </span>
			<span><icon name="ellipsis-v"></icon> </span>	
		</div>

		<span v-show="type==='theme'">
			<icon name="plus-circle" scale=1.2></icon>
			<!-- <icon name="minus-circle"></icon> -->
		</span>

		<div v-show="type==='detail'">
			<span class="navbar-icon"><icon name="share-alt"></icon> </span>
			<span class="navbar-icon"><icon name="star"></icon> </span>	
			<span class="navbar-icon"><icon name="commenting"></icon> </span>
			<span class="navbar-icon"><icon name="thumbs-up"></icon> </span>	
		</div>
		
	</header>
</template>

<script>
	export default{
		computed:{
			type(){
				return this.$store.state.topBar.type
			},
			name(){
				return this.$store.state.topBar.name
			}
		},
		components:{
			//Icon
		},
		methods:{
			showLeftBar(){
				this.$store.commit('toggleLeftBar')
			},
			routerBack(){
				this.$router.back()
			}
		}
	}
</script>

<style>
	.navbar{
		position: fixed;
		top: 0;
		left: 0;
		width:100%;
		display: flex;
		align-items:center;
		height:50px;
		background-color: #00a2ea;
		color:#fff;
		z-index: 1;
	    padding: 0 16px;
	}
	.navbar-right{
		flex: 2;
    	/*text-align: center;*/
	}
	.navbar-right span{
	    margin-left: 22px;
	}
	.navbar-span-title{
		flex:8;
	    font-size: 17px;
    	font-weight: normal;
	}
	.navbar-icon{
		flex:1;
	}
	.navbar-icon-menu{
		flex:1;
		margin-top: 4px;
	}
</style>