/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules,l=require("./lua_highlight_rules").LuaHighlightRules,i=function(){t.call(this);var e=[{token:"keyword",regex:"<\\%\\=?",push:"lua-start"},{token:"keyword",regex:"<\\?lua\\=?",push:"lua-start"}];for(var i in this.embedRules(l,"lua-",[{token:"keyword",regex:"\\%>",next:"pop"},{token:"keyword",regex:"\\?>",next:"pop"}],["start"]),this.$rules)this.$rules[i].unshift.apply(this.$rules[i],e);this.normalizeRules()};e.inherits(i,t),exports.LuaPageHighlightRules=i});
//# sourceMappingURL=../sourcemaps/mode/luapage_highlight_rules.js.map
