/*
 * @Descripttion: 
 * @version: 
 * @Author: @yulun
 * @Date: 2022-08-01 15:06:47
 * @LastEditors: @yulun
 * @LastEditTime: 2022-08-01 16:40:46
 */
function Compile(vm){
  this.vm = vm;
  this.el = vm.$el;
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init:function(){
    this.fragment = this.nodeFragment(this.el);
    this.compileNode(this.fragment);
    console.log('this.el===>',this.el);
    this.el.appendChild(this.fragment); // 解析完成添加到元素中
  },
  nodeFragment:function(el){
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while(child){
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileNode:function(fragment){
    let childNodes = fragment.childNodes;
    [...childNodes].forEach(node=>{
      if(this.isElementNode(node)){
        this.compile(node);
      }
      let reg = /\{\{(.*)\}\}/;
      let text = node.textContent;

      if(reg.test(text)){
        let prop = reg.exec(text)[1];
        this.compileText(node,prop); // 替换模板
      }

      // 编译子节点
      if(node.childNodes&&node.childNodes.length){
        this.compileNode(node);
      }
    })
  },
  compile:function(node){
    console.log('node===>',node);
    let nodeAttrs = node.attributes;
    [...nodeAttrs].forEach(attr => {
      let name = attr.name;
      if(this.isDirective(name)){
        let value = attr.value;
        if(name === "v-model"){
          this.compileModel(node, value);
        }
      }
    });
  },
  compileModel:function(node,prop){
    let val = this.vm.$data[prop];
    this.updateModel(node,val);

    new Watcher(this.vm,prop,(value)=>{
      this.updateModel(node,value);
    });

    node.addEventListener('input',e=>{
      let newValue = e.target.value;
      if(newValue === val){
        return;
      }
      this.vm.$data[prop] = newValue;
    })
  },
  compileText:function(node,prop){
    let text = this.vm.$data[prop];
    this.updateView(node,text);
    new Watcher(this.vm,prop,(value)=>{
      this.updateView(node,value);
    })
  },
  updateModel:function(node,value){
    node.value = typeof value === 'undefined'?'':value;
  },
  updateView:function(node,value){
    node.textContent = typeof value === 'undefined'?'':value;
  },
  isDirective:function(name){
    return name.indexOf('v-') !== -1;
  },
  isElementNode:function(node){
    return node.nodeType === 1;
  },
  isTextNode:function(node){
    return node.nodeType === 3;
  }
}