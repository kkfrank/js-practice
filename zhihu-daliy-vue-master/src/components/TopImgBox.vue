<template>
	<!-- <div v-if="Array.isArray(sliderList)" class="top-image-container"> -->
	<div v-if="type==='list'" class="top-image-container">
		<Slider :list="sliderList" :defaultActive="1"></Slider>
	</div>
	<div v-else-if="sliderList.length>0" class="theme-img top-image-container" :style="{backgroundImage:'url('+sliderList[0].background.replace('http:','https:')+')'}">
		<!-- <img :src="sliderList[0].background.replace('http:','https:')"/> -->
		<div class="detail-overlay"></div>
		<h3>{{sliderList[0].description}}</h3>
		
	</div>
</template>

<script>
	import Slider from './Slider.vue'
	export default{
		props:['sliderList'],
		mounted:function(){
			console.log('sliderList',this.type,this.sliderList)
		},
		computed:{
			type:function(){
				return this.$store.state.topBar.type
			}
		},	
		components:{
			Slider
		}
	}
</script>

<style>
	.top-image-container{
	    position: relative;
		width: 100%;
		height: 300px;
	    background-size: cover;
	}
	.theme-img img{
	  	height: 300px;
	    width: 100%;
	}
	.detail-overlay{
		position: absolute;
		left: 0;
		top:0;
	    width: 100%;
    	height: 100%;
    	background: rgb(0,0,0);
    	opacity: 0.3;
/*		background: rgba(0,0,0,0.3);*/
	}

	.theme-img h3{
		position: absolute;
	    bottom: 26px;
	    color: #fff;
	    padding: 0 20px;
	}
</style>