/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,l){"use strict";var i=e("../lib/oop"),s=e("./html_highlight_rules").HtmlHighlightRules,h=e("./lua_highlight_rules").LuaHighlightRules,r=function(){s.call(this);var e=[{token:"keyword",regex:"<\\%\\=?",push:"lua-start"},{token:"keyword",regex:"<\\?lua\\=?",push:"lua-start"}];for(var t in this.embedRules(h,"lua-",[{token:"keyword",regex:"\\%>",next:"pop"},{token:"keyword",regex:"\\?>",next:"pop"}],["start"]),this.$rules)this.$rules[t].unshift.apply(this.$rules[t],e);this.normalizeRules()};i.inherits(r,s),t.LuaPageHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/luapage_highlight_rules.js.map
