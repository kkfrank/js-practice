function Lottery(option){
    this.elem=option.elem;//元素
    this.id=null;//定时器id
    this.speed=option.speed || 19;//速度
}
Lottery.prototype={
    constructor:Lottery,
    start:function(){
        var that=this;
        this.id=setInterval(function(){
            var top=parseInt(that.elem.style.top);
            var next=top+30;
            if(next>=0){
                next=-1800
            }
            that.elem.style.top=next+"px";
        },this.speed)
    },
    stop:function(num){
        clearInterval(this.id);
        if(num<0 || num>9){
            console.log("无效数字");
            return;
        }
        var top=(num-9)*height;//根据num值计算top,  [0,1,2,3...9] => [-1800,-1600,-1400...0]
        this.elem.style.top=top+"px";
    },
    reset:function(){//置0
        clearInterval(this.id);
        this.elem.style.top="-1800px";
    }
};

function LotteryManager(arr){
    this.arr=arr;
    this.isStop=true;//动画是否结束
}
LotteryManager.prototype={
    constructor:LotteryManager,
    startAll:function(){
        this.isStop=false;
        for(var i= 0,lottery;lottery=this.arr[i++];){
            lottery.start();
        }
    },
    stopAll:function(lucky,fn){
        if(!lucky){
            this.resetAll();
            alert("不能为空")
            return;
        }
        var that=this;
        for(var i= 0,len=this.arr.length;i<len;i++){
            (function(i){
                setTimeout(function(){
                    var lottery=that.arr[i];
                    lottery.stop(lucky[i]);
                    if(i===len-1){
                        that.isStop=true;
                        fn && fn();
                    }
                },i*400)
            })(i);
        }
    },
    resetAll:function(){
        for(var i= 0,len=this.arr.length;i<len;i++){
            var lottery=this.arr[i];
            lottery.reset();
        }
        this.isStop=true;
    }
};

function addClassName(el,name){
    var prev=el.className;
    if(prev.indexOf(name)<0){
        el.className=prev+" "+name
    }
}
function removeClassName(el,name){
    var prev=el.className;
    prev=prev.replace(name,"").replace(/^\s*/,"").replace(/\s*$/,"")
    el.className=prev;
}

//测试函数
function generate(len){
    var arr=[]
    for(var i=0;i<len;i++){
        var rnd=parseInt(Math.random()*10);
        arr.push(rnd);
    }
    return {
        nums:arr,
        name:"your name",
        departm:"your dept"
    }
}  

