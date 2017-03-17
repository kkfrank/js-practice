function Printer(el){
	this.el=el;
	this.timer=0;
}
Printer.prototype.print=function(text){
	var self=this;
	if(!self.el){
		console.error("Printer参数缺失");
		return;
	}
	setTimeout(function(){
		var tmpl="<p class='each-line'>"+text+"</p>"
		self.el.insertAdjacentHTML("beforeend",tmpl)
	},this.timer);
	this.timer+=1500;
}
Printer.prototype.clear=function(){
	var self=this;
	setTimeout(function(){
		self.el.innerHTML="";
		self.timer=0;
	},this.timer)
}