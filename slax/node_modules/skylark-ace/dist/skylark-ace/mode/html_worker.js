/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var r=t("../lib/oop"),o=(t("../lib/lang"),t("../worker/mirror").Mirror),i=t("./html/saxparser").SAXParser,c={"expected-doctype-but-got-start-tag":"info","expected-doctype-but-got-chars":"info","non-html-root":"info"},s=e.Worker=function(t){o.call(this,t),this.setTimeout(400),this.context=null};r.inherits(s,o),function(){this.setOptions=function(t){this.context=t.context},this.onUpdate=function(){var t=this.doc.getValue();if(t){var e=new i,n=[],r=function(){};e.contentHandler={startDocument:r,endDocument:r,startElement:r,endElement:r,characters:r},e.errorHandler={error:function(t,e,r){n.push({row:e.line,column:e.column,text:t,type:c[r]||"error"})}},this.context?e.parseFragment(t,this.context):e.parse(t),this.sender.emit("error",n)}}}.call(s.prototype)});
//# sourceMappingURL=../sourcemaps/mode/html_worker.js.map
