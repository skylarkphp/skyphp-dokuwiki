/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("../worker/mirror").Mirror,o=require("../mode/coffee/coffee");window.addEventListener=function(){};var n=exports.Worker=function(e){t.call(this,e),this.setTimeout(250)};e.inherits(n,t),function(){this.onUpdate=function(){var e=this.doc.getValue(),t=[];try{o.compile(e)}catch(e){var n=e.location;n&&t.push({row:n.first_line,column:n.first_column,endRow:n.last_line,endColumn:n.last_column,text:e.message,type:"error"})}this.sender.emit("annotate",t)}}.call(n.prototype)});
//# sourceMappingURL=../sourcemaps/mode/coffee_worker.js.map
