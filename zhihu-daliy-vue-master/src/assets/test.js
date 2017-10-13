/**
	1.扁平化数组
**/
var arr=[1,2,[3,4],[3,4,[5],6,7],8,[9,10],11]

var ans=[]
function flatten1(arr){
	for(var i=0,item;item=arr[i++];){
		if(Object.prototype.toString.call(item)==="[object Array]"){
			flatten(item)
		}else{
			ans.push(item)
		}
	}
	return ans
}

function flatten2(arr,ans){
	if(!ans){
		ans=[]
	}
	for(var i=0;i<arr.length;i++){
		if(Array.isArray(arr[i])){
			flatten3(arr[i],ans)
		}else{
			ans.push(arr[i])
		}
	}
	return ans
}
function flatten3(arr){
	return arr.reduce(function(prev,item,index){
		return prev.concat(Array.isArray(item) ? flatten4(item) : item)
		/*if(Array.isArray(item)){
			prev=prev.concat(flatten4(item))
		}else{
			prev.push(item)
		}
		return prev*/
	},[])
}
function flatten4(arr){//number会转换成string
	return arr.toString().split(',')
}

/**
	1.数组去重
**/
function unique(arr){
	
}
/*function unique(arr){
	var map={},ans=[]
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i]
		if(map[item]===undefined){
			ans.push(arr[i])
			map[item]=true
		}
	}
	var ans1=ans.concat()
	console.log(ans1.sort((a,b)=>a-b))
	quickSort(ans)
	return ans//.sort((a,b)=>a-b)
}
*/


function quickSort(arr){
	_quickSort(arr,0,arr.length-1)
}
function _quickSort(arr,lo,hi){
	if(lo>=hi) return
	var j=_partition(arr,lo,hi)
	_quickSort(arr,lo,j-1)
	_quickSort(arr,j+1,hi)
}
function change(arr,i,j){
	var temp=arr[i]
	arr[i]=arr[j]
	arr[j]=temp
}
function _partition(arr,lo,hi){
	var i=lo,j=hi+1,temp=arr[lo]
	while(true){
		while(arr[++i]<=temp) {if(i>=hi) break}
		while(arr[--j]>=temp) {if(j<=lo) break}
		if(i>=j){
			break
		}else{
			change(arr,i,j)	
		}
	}
	change(arr,lo,j)
	return j
}


var config1={
	render:"#t1",
	friends:[1,2,3,4,5],
	async:{
		fn:function(){
			console.log(this)
		}
	}
}
function clone(source){
	//var list=[].slice.call(arguments)
	if(typeof source!=='object'){
		return source
	}
	var target=Array.isArray(source)?[]:{}
	for(var i in source){
		if(typeof source[i]!=='object'){//基本类型
			target[i]=source[i]
		}else{
			target[i]=clone(source[i])
		}
	}
	return target

}
function extend(){
	var target=arguments[0]
	for(var i=1;i<arguments.length;i++){
		for(var j in arguments[i]){
			target[j]=clone(arguments[i][j])
			//target[j]=arguments[i][j]
		}
	}
	return target
}
var target=extend({},config1,{render:"#t2"})
/*console.log('----------')
console.log(target)
console.log(target.friends===config1.friends)*/



