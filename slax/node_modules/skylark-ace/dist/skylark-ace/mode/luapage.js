/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var l=e("../lib/oop"),a=e("./html").Mode,h=e("./lua").Mode,o=e("./luapage_highlight_rules").LuaPageHighlightRules,u=function(){a.call(this),this.HighlightRules=o,this.createModeDelegates({"lua-":h})};l.inherits(u,a),function(){this.$id="ace/mode/luapage"}.call(u.prototype),i.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/luapage.js.map
