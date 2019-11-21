/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,r){"use strict";var o=t("../lib/oop"),i=t("../worker/mirror").Mirror,n=t("../mode/lua/luaparse"),a=e.Worker=function(t){i.call(this,t),this.setTimeout(500)};o.inherits(a,i),function(){this.onUpdate=function(){var t=this.doc.getValue(),e=[];try{n.parse(t)}catch(t){t instanceof SyntaxError&&e.push({row:t.line-1,column:t.column,text:t.message,type:"error"})}this.sender.emit("annotate",e)}}.call(a.prototype)});
//# sourceMappingURL=../sourcemaps/mode/lua_worker.js.map
