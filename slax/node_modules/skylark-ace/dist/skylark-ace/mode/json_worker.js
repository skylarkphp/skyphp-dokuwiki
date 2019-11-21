/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,o,r){"use strict";var e=t("../lib/oop"),i=t("../worker/mirror").Mirror,n=t("./json/json_parse"),s=o.JsonWorker=function(t){i.call(this,t),this.setTimeout(200)};e.inherits(s,i),function(){this.onUpdate=function(){var t=this.doc.getValue(),o=[];try{t&&n(t)}catch(t){var r=this.doc.indexToPosition(t.at-1);o.push({row:r.row,column:r.column,text:t.message,type:"error"})}this.sender.emit("annotate",o)}}.call(s.prototype)});
//# sourceMappingURL=../sourcemaps/mode/json_worker.js.map
