<template>
	<div v-if="Array.isArray(sliderList)" class="top-image-container">
		<Slider :list="sliderList" :defaultActive="1"></Slider>
	</div>
	<div v-else class="theme-img top-image-container">
		<img :src="sliderList.replace('http:','https:')"/>
		<h3>{{sliderList.description}}</h3>
	</div>
</template>

<script>
	import Slider from './Slider.vue'
	export default{
		props:['sliderList'],
		components:{
			Slider
		}
	}
</script>

<style>
	.top-image-container{
	    position: relative;
		width: 100%;
		height: 100%;
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
		background: rgba(0,0,0,0.3);
	}
</style>