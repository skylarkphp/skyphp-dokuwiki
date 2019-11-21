/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,o){"use strict";var n=e("../lib/oop"),i=e("../worker/mirror").Mirror,r=e("../mode/coffee/coffee");window.addEventListener=function(){};var c=t.Worker=function(e){i.call(this,e),this.setTimeout(250)};n.inherits(c,i),function(){this.onUpdate=function(){var e=this.doc.getValue(),t=[];try{r.compile(e)}catch(e){var o=e.location;o&&t.push({row:o.first_line,column:o.first_column,endRow:o.last_line,endColumn:o.last_column,text:e.message,type:"error"})}this.sender.emit("annotate",t)}}.call(c.prototype)});
//# sourceMappingURL=../sourcemaps/mode/coffee_worker.js.map
