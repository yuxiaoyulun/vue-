/*
 * @Descripttion: 
 * @version: 
 * @Author: @yulun
 * @Date: 2022-08-01 14:21:45
 * @LastEditors: @yulun
 * @LastEditTime: 2022-08-01 16:34:46
 */
function MyVue(options,prop){
  this.$options = options;
  this.$data = options.data;
  this.$el = document.querySelector(options.el);
  this.$prop = prop;
  // 数据代理
  Object.keys(this.$data).forEach(key=>this.proxyData(key));
  this.init();
}

MyVue.prototype.init = function(){
  observer(this.$data);
  new Compile(this);
}

MyVue.prototype.proxyData = function(key){
  Object.defineProperty(this,key,{
    get:function(){
      return this.$data[key];
    },
    set:function(value){
      this.$data[key] = value;
    }
  })
}