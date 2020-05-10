/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=(require("../lib/lang"),require("../worker/mirror").Mirror),n=require("./html/saxparser").SAXParser,r={"expected-doctype-but-got-start-tag":"info","expected-doctype-but-got-chars":"info","non-html-root":"info"},o=exports.Worker=function(t){e.call(this,t),this.setTimeout(400),this.context=null};t.inherits(o,e),function(){this.setOptions=function(t){this.context=t.context},this.onUpdate=function(){var t=this.doc.getValue();if(t){var e=new n,o=[],i=function(){};e.contentHandler={startDocument:i,endDocument:i,startElement:i,endElement:i,characters:i},e.errorHandler={error:function(t,e,n){o.push({row:e.line,column:e.column,text:t,type:r[n]||"error"})}},this.context?e.parseFragment(t,this.context):e.parse(t),this.sender.emit("error",o)}}}.call(o.prototype)});
//# sourceMappingURL=../sourcemaps/mode/html_worker.js.map
