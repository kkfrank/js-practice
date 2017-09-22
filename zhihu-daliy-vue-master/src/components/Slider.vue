<template>
	<div class="slider-box">
		<div class="slider-inner" :style="{width:list.length+'00%',left:left}">
			<router-link :to="'/detail/'+item.id" v-for="item in list" :key="item.id" class="slider-link">
				<img :src="item.image"/>
				<h3>{{item.title}}</h3>
			</router-link>
		</div>
		<ul class="slider-nums" v-on:click="jumpTopage">
			<li v-for="i in list.length" :class="{on:active==i}" :data-id="i"></li>
		</ul>
	</div>
</template>

<script>
	export default{
		props:['list',"defaultActive"],
		created:function(){
			//console.log(this.active,typeof(this.active))
		},
		computed:{
			
			left:function(){//active:下标从1开始
				if(this.active-1===0){
					return 0;
				}
					//1: left 0%
					//2  left -100%
					//3 left -200%
				return "-"+(this.active-1)+"00%"
			}
		},
		data(){
			return{
				active:this.defaultActive
			}
		},
		methods:{
			jumpTopage(event){
			    event.preventDefault()
				var id=event.target.getAttribute('data-id')
				id &&  (this.active=id)
			}
		}
	}
</script>

<style>
	.slider-box{
		position: relative;
		width: 100%;
		height: 300px;
		overflow: hidden;
	}
	.slider-box .slider-inner{
		position: absolute;
		/*width: 500%;*/
		height: 100%;
	}
	.slider-box img{
		height: 300px;
    	width: 100%;
	}
	.slider-inner .slider-link{
	    display: flex;
    	justify-content: center;
	    position: relative;
		float: left;
		width: 20%;
	}
	.slider-link h3{
	    position: absolute;
	    bottom: 26px;
	    color: #fff;
	    padding: 0 20px;
	}
	.slider-nums{
		position: absolute;
	    bottom: 10px;
	    right: 50%;
	    transform: translate(50%,0);
	}
	.slider-nums li{
		width: 8px;
	    height: 8px;
	    border-radius: 50%;
	    background-color: #aaa;
	    float: left;
	    list-style: none;
	    margin: 0 4px;
	}
	.slider-nums li.on{
	    background-color: #fff;
	}
</style>