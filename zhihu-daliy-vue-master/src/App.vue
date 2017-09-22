<template>
	<div>
		<!-- <TopBar/> -->
		<div class="loading"></div>
		<router-view></router-view>
	</div>
</template>

<script>
	import TopBar from './components/TopBar'
	//import Home from './views/Home.vue'

	export default{
		data(){
			return{
				msg:"hello world"
			}
		},
		components:{
			TopBar,
		},
		computed:{
			type:function(){
				return this.$store.state.topBar.type
			}
		},
		created(){
			var that=this,type=this.type,isUp=true
		    window.addEventListener('scroll',function(ev){
		    	//console.log(document.body.scrollTop)
		    	if(document.body.scrollTop===0){//到顶了
		    		console.log('到顶了',type)
		    		isUp=true
		    	}else{
		    		isUp=false
		    	}
		    	if(document.body.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight){
		    		console.log('到底了',type)
		    		if(type==="list" || type==="theme"){
		    			that.$store.dispatch({
			    			type:"loadMore"
			    		})	
		    		}
		    	}
		    	//console.log(document.body.scrollTop,window.innerHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight)
		    })
		    var validTouch=false,startY=0,prevMoveY=0
	
		    window.addEventListener('touchstart',function(ev){
		    	var main=document.querySelector('.main')
		    	if(isUp && (ev.target===main || main.contains(ev.target))){//滑动的是main元素
		    		validTouch=true
		    		prevMoveY=startY=ev.touches[0].pageY
		    	}else{
		    		validTouch=false
		    	}
		    })
	      	window.addEventListener('touchmove',function(ev){
  			    var loading=document.querySelector('.loading')
	      		if(!validTouch){
	      			return
	      		}
	      		var y=ev.touches[0].pageY
	      		var prevY=parseInt(loading.style.top || 0)
	      		var changedY=y-prevMoveY
	      		prevMoveY=y
	      		y=prevY+changedY
	      		if(y>=100) y=100
      		    loading.style.top=y+"px"
		    })
	        window.addEventListener('touchend',function(ev){
	        	if(!validTouch){
	      			return
	      		}
	      		that.$store.dispatch('getHomeListToday')
	      		var loading=document.querySelector('.loading')
	      		loading.style.top=0
		    })
		}
	}
</script>

<style>
	html,body{
		width: 100%;
		height:100%;
	}
	*{
		margin: 0;
		padding: 0;
		box-sizing:border-box;
	}
	li{
		list-style: none;
	}
	.loading{
	    position: fixed;
	    width: 40px;
	    height: 40px;
	    z-index: 1;
	    left: 44%;
	    top: 0;
	    border: 4px solid green;
	    border-radius: 50%;
	    border-right: 4px solid transparent;
	    border-top: 4px solid transparent;
	    transform: rotate(45deg);
	    animation: rotate .6s infinite linear;
	    margin-top: 11px;
	}

	@keyframes rotate{
		from {
			transform: rotate(45deg);
		}
		to{
			transform: rotate(405deg);
		}
	}
</style>