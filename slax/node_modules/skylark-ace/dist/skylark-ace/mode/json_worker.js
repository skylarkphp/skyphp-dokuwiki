/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),o=require("../worker/mirror").Mirror,r=require("./json/json_parse"),e=exports.JsonWorker=function(t){o.call(this,t),this.setTimeout(200)};t.inherits(e,o),function(){this.onUpdate=function(){var t=this.doc.getValue(),o=[];try{t&&r(t)}catch(t){var e=this.doc.indexToPosition(t.at-1);o.push({row:e.row,column:e.column,text:t.message,type:"error"})}this.sender.emit("annotate",o)}}.call(e.prototype)});
//# sourceMappingURL=../sourcemaps/mode/json_worker.js.map
