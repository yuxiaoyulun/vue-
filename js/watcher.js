/*
 * @Descripttion: 
 * @version: 
 * @Author: @yulun
 * @Date: 2022-08-01 16:25:36
 * @LastEditors: @yulun
 * @LastEditTime: 2022-08-01 16:30:06
 */
function Watcher(vm,prop,callback){
  this.vm = vm;
  this.prop = prop;
  this.callback = callback;
  this.value = this.get();
}

Watcher.prototype = {
  update:function(){
    const value = this.vm.$data[this.prop];
    const oldVal = this.value;
    if(value !== oldVal){
      this.value = value;
      this.callback(value);
    }
  },
  get:function(){
    Dep.target = this;
    const value = this.vm.$data[this.prop]; // 因为属性被监听，这一步会执行监听器里的get方法
    Dep.target = null;
    return value;
  }
}