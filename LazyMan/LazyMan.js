function LazyMan(text){
	return new _LazyMan(text);
}
function _LazyMan(name){
	this.list=[];
	var self=this;
	var fn=function(){
		console.log(name);
		self.next();
	};
	this.list.push(fn);
	setTimeout(function(){
		self.next();
	},0)
}
_LazyMan.prototype={
	constructor:_LazyMan,
	next:function(){
		var fn=this.list.shift();
		fn && fn();
	},
	sleep:function(time){
		var self=this;
		var fn=function(){
			setTimeout(function(){
				console.log("wake up after "+time+"s")
				self.next();
			},time*1000)
		};
		this.list.push(fn);
		return this;
	},
	eat:function(name){
		var self=this;
		var fn=function(){
			console.log("eat "+name)
			self.next();
		};
		this.list.push(fn);
		return this;
	},
	sleepFirst:function(time){
		var self=this;
		var fn=function(){
			setTimeout(function(){
				console.log("sleepFirst after "+time+"s");
				self.next();
			},time*1000);
		};
		this.list.unshift(fn);
		return this;
	}
}
//LazyMan('Hank1')
//LazyMan('Hank2').eat('dinner2').eat('supper2')
LazyMan('Hank3').sleep(3).eat('dinner3').sleep(2).eat('supper')
//LazyMan('Hank4').eat('dinner4').eat('supper4')
//LazyMan('Hank5').sleepFirst(2).eat('supper5')
