/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(r,t,e){"use strict";var n=r("../lib/oop"),o=(r("../lib/lang"),r("../worker/mirror").Mirror),i=r("./xml/dom-parser").DOMParser,u=t.Worker=function(r){o.call(this,r),this.setTimeout(400),this.context=null};n.inherits(u,o),function(){this.setOptions=function(r){this.context=r.context},this.onUpdate=function(){var r=this.doc.getValue();if(r){var t=new i,e=[];t.options.errorHandler={fatalError:function(r,t,n){e.push({row:n.lineNumber,column:n.columnNumber,text:t,type:"error"})},error:function(r,t,n){e.push({row:n.lineNumber,column:n.columnNumber,text:t,type:"error"})},warning:function(r,t,n){e.push({row:n.lineNumber,column:n.columnNumber,text:t,type:"warning"})}},t.parseFromString(r),this.sender.emit("error",e)}}}.call(u.prototype)});
//# sourceMappingURL=../sourcemaps/mode/xml_worker.js.map
