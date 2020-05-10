/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var r=require("../lib/oop"),t=(require("../lib/lang"),require("../worker/mirror").Mirror),e=require("./xml/dom-parser").DOMParser,n=exports.Worker=function(r){t.call(this,r),this.setTimeout(400),this.context=null};r.inherits(n,t),function(){this.setOptions=function(r){this.context=r.context},this.onUpdate=function(){var r=this.doc.getValue();if(r){var t=new e,n=[];t.options.errorHandler={fatalError:function(r,t,e){n.push({row:e.lineNumber,column:e.columnNumber,text:t,type:"error"})},error:function(r,t,e){n.push({row:e.lineNumber,column:e.columnNumber,text:t,type:"error"})},warning:function(r,t,e){n.push({row:e.lineNumber,column:e.columnNumber,text:t,type:"warning"})}},t.parseFromString(r),this.sender.emit("error",n)}}}.call(n.prototype)});
//# sourceMappingURL=../sourcemaps/mode/xml_worker.js.map
