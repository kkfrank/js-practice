<template>
	<header class="navbar">
		<slot name="left"></slot>
		<h1 v-show="title!=null" h1 class="navbar-title">{{title}}</h1>
		<slot name="right"></slot>
	</header>
</template>

<script>
	export default{
		props:['title']
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
	.navbar-title{
		flex:8;
	    font-size: 17px;
    	font-weight: normal;
	}
	.navbar-left{
		flex:1;
		margin-top: 4px;
	}
	.navbar-right{
		flex: 2;
	    display: flex;
    	justify-content: space-between;
	}
	.navbar-right-theme{
		flex:1;
		text-align: center;
	}
	.navbar-right-detail{
		flex:3;
		text-align: right;
	}
	.navbar-right-detail span{
		margin-right: 22px;
	}
	.navbar-right span{
	    /*margin-left: 22px;*/
	}
</style>