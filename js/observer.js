function defineReactive(data,key,value){
  let dep = new Dep();
  observer(value);
  Object.defineProperty(data,key,{
    get:function(){
      if(Dep.target){
        dep.addSub(Dep.target);
      }
      return value;
    },
    set:function(newVal){
      if(newVal !== value){
        value = newVal;
        dep.notify();
      }
    }
  })
}

function observer(data){
  if(!data || typeof data !== 'object'){
    return;
  }
  Object.keys(data).forEach(key=>{
    defineReactive(data,key,data[key]);
  })
}

function Dep(){
  this.subs = [];
}

Dep.prototype.addSub = function(sub){
  this.subs.push(sub);
}

Dep.prototype.notify = function(){
  this.subs.forEach(sub=>sub.update());
}
Dep.target = null;