/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("../worker/mirror").Mirror,a=require("./xquery/xqlint"),i=a.XQLint,s=exports.XQueryWorker=function(e){t.call(this,e),this.setTimeout(200);var a=this;this.sender.on("complete",function(e){if(a.xqlint){var t={line:e.data.pos.row,col:e.data.pos.column},i=a.xqlint.getCompletions(t);a.sender.emit("complete",i)}}),this.sender.on("setAvailableModuleNamespaces",function(e){a.availableModuleNamespaces=e.data}),this.sender.on("setFileName",function(e){a.fileName=e.data}),this.sender.on("setModuleResolver",function(e){var t;a.moduleResolver=(t=e.data,function(e){var a=t[e],i={},s={};return a.functions.forEach(function(t){s[e+"#"+t.name+"#"+t.arity]={params:[]},t.parameters.forEach(function(a){s[e+"#"+t.name+"#"+t.arity].params.push("$"+a.name)})}),a.variables.forEach(function(t){var a=t.name.substring(t.name.indexOf(":")+1);i[e+"#"+a]={type:"VarDecl",annotations:[]}}),{variables:i,functions:s}})})};e.inherits(s,t),function(){this.onUpdate=function(){this.sender.emit("start");var e=this.doc.getValue(),t=a.createStaticContext();this.moduleResolver&&t.setModuleResolver(this.moduleResolver),this.availableModuleNamespaces&&(t.availableModuleNamespaces=this.availableModuleNamespaces);var s={styleCheck:this.styleCheck,staticContext:t,fileName:this.fileName};this.xqlint=new i(e,s),this.sender.emit("markers",this.xqlint.getMarkers())}}.call(s.prototype)});
//# sourceMappingURL=../sourcemaps/mode/xquery_worker.js.map
