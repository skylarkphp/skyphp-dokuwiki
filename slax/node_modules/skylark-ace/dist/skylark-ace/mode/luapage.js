/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./html").Mode,t=require("./lua").Mode,l=require("./luapage_highlight_rules").LuaPageHighlightRules,a=function(){i.call(this),this.HighlightRules=l,this.createModeDelegates({"lua-":t})};e.inherits(a,i),function(){this.$id="ace/mode/luapage"}.call(a.prototype),exports.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/luapage.js.map
