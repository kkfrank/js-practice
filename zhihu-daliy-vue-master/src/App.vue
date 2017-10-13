<template>
	<div>
		<div class="loading"></div>
		<router-view name="main"></router-view>
		<router-view name="leftbar"></router-view>
	</div>
</template>

<script>
	export default{
		computed:{
		/*	type:function(){
				console.log('computed',this.$store.state.topBar.type)
				return this.$store.state.topBar.type
			}*/
		},
		created(){
		    this.$store.dispatch({//获取leftbar中theme的种类
		    	type:"getThemesTypes"
		    })

			var that=this,isUp=true
		    window.addEventListener('scroll',function(ev){
		    	var type=that.$store.state.topBar.type
	    	 	if(type!=="list" && type !=="theme"){
		    		return
		    	}
		    	if(document.body.scrollTop===0){//到顶了
		    		console.log('到顶了',type)
		    		isUp=true
		    	}else{
		    		isUp=false
		    	}
		    	//if(document.body.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight){
	    		if(document.body.scrollTop !==0 && document.body.scrollTop+document.documentElement.clientHeight===document.documentElement.scrollHeight){
		    		console.log('到底了',type,that.$store.state.topBar.type)
		    		if(type==="list" || type==="theme"){
		    			that.$store.dispatch({
			    			type:"loadMore",
			    			id:that.$route.params.id
			    		})	
		    		}
		    	}
		    })
		    var validTouch=false,startY=0,prevMoveY=0
	
		    window.addEventListener('touchstart',function(ev){//刷新
		    /*	var type=that.$store.state.topBar.type
		    	if(type!=="list" && type !=="theme"){
		    		return
		    	}*/
		    	var main=document.querySelector('.main')
		    	if(isUp && main && (ev.target===main || main.contains(ev.target))){//滑动的是main元素
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
	        	var type=that.$store.state.topBar.type
	        	if(!validTouch){
	      			return
	      		}
      			if(type==="list"){//刷新主页
	    			that.$store.dispatch('getHomeLatest')
	    		}else{
					that.$store.dispatch({
		    			type:"getThemeListNow",
		    			id:that.$route.params.id
		    		})
	    		}
	      		
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
	a{
		text-decoration: none;
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