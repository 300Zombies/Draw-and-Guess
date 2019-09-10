// Cache
class Cache{
	constructor(max){
		this.max=max;
		this.data=[];
	}
	set(key, value){
		let index=this.findLastIndexOf(key);
		if(index>-1){ // update existing data
			let item=this.data.splice(index, 1)[0];
			item.value=value;
			this.data.push(item);
		}else{ // add new data
			this.data.push({key:key, value:value});
			if(this.data.length>this.max){ // cache larger than max
				// clear 1/2 cache data once
				this.data.splice(0, Math.floor(this.data.length/2));
			}
		}
	}
	get(key){
		let index=this.findLastIndexOf(key);
		return index>-1?this.data[index].value:null;
	}
	remove(key){
		let index=this.findLastIndexOf(key);
		if(index>-1){
			this.data.splice(index, 1);
		}
	}
	findLastIndexOf(key){
		for(let i=this.data.length-1;i>-1;i--){
			if(this.data[i].key===key){
				return i;
			}
		}
		return -1;
	}
}
module.exports=function(max){
	if(typeof max==="undefined" || max<20){
		max=20;
	}
	return new Cache(max);
};