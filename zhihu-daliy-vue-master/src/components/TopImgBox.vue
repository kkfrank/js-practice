<template>
	<Slider v-if="Array.isArray(sliderList)" :list="sliderList" :defaultActive="1"></Slider>
	<div v-else class="theme-img">
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
	.theme-img img{
	  	height: 300px;
	    width: 100%;
	}
</style>