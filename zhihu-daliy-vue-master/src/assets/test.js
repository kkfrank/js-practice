var arr=[2,5,7,8,4,5,1,2,[3,4,5,[6,7,8],8],8810,[8,8]]

console.log({}.toString.call(arr))
var ans=[]
function flatten(arr){
	for(var i=0,item;item=arr[i++];){
		if(Object.prototype.toString.call(item)==="[object Array]"){
			flatten(item)
		}else{
			ans.push(item)
		}
	}
	return ans
}
function unique(arr){
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

/*console.log(flatten(arr))
console.log(unique(ans))*/

var arr={}
arr[20170922]=1
console.log(arr)