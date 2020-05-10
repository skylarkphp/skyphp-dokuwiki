/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("../worker/mirror").Mirror,r=require("../mode/lua/luaparse"),o=exports.Worker=function(t){e.call(this,t),this.setTimeout(500)};t.inherits(o,e),function(){this.onUpdate=function(){var t=this.doc.getValue(),e=[];try{r.parse(t)}catch(t){t instanceof SyntaxError&&e.push({row:t.line-1,column:t.column,text:t.message,type:"error"})}this.sender.emit("annotate",e)}}.call(o.prototype)});
//# sourceMappingURL=../sourcemaps/mode/lua_worker.js.map
