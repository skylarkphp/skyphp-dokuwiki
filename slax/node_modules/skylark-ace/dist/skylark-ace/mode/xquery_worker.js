/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,a){"use strict";var i=e("../lib/oop"),s=e("../worker/mirror").Mirror,n=e("./xquery/xqlint"),o=n.XQLint,r=t.XQueryWorker=function(e){s.call(this,e),this.setTimeout(200);var t=this;this.sender.on("complete",function(e){if(t.xqlint){var a={line:e.data.pos.row,col:e.data.pos.column},i=t.xqlint.getCompletions(a);t.sender.emit("complete",i)}}),this.sender.on("setAvailableModuleNamespaces",function(e){t.availableModuleNamespaces=e.data}),this.sender.on("setFileName",function(e){t.fileName=e.data}),this.sender.on("setModuleResolver",function(e){var a;t.moduleResolver=(a=e.data,function(e){var t=a[e],i={},s={};return t.functions.forEach(function(t){s[e+"#"+t.name+"#"+t.arity]={params:[]},t.parameters.forEach(function(a){s[e+"#"+t.name+"#"+t.arity].params.push("$"+a.name)})}),t.variables.forEach(function(t){var a=t.name.substring(t.name.indexOf(":")+1);i[e+"#"+a]={type:"VarDecl",annotations:[]}}),{variables:i,functions:s}})})};i.inherits(r,s),function(){this.onUpdate=function(){this.sender.emit("start");var e=this.doc.getValue(),t=n.createStaticContext();this.moduleResolver&&t.setModuleResolver(this.moduleResolver),this.availableModuleNamespaces&&(t.availableModuleNamespaces=this.availableModuleNamespaces);var a={styleCheck:this.styleCheck,staticContext:t,fileName:this.fileName};this.xqlint=new o(e,a),this.sender.emit("markers",this.xqlint.getMarkers())}}.call(r.prototype)});
//# sourceMappingURL=../sourcemaps/mode/xquery_worker.js.map
