/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var l=e("../lib/oop"),r=e("./html_highlight_rules").HtmlHighlightRules,s=e("./elixir_highlight_rules").ElixirHighlightRules,n=function(){r.call(this);var e=[{regex:"<%%|%%>",token:"constant.language.escape"},{token:"comment.start.eex",regex:"<%#",push:[{token:"comment.end.eex",regex:"%>",next:"pop",defaultToken:"comment"}]},{token:"support.elixir_tag",regex:"<%+(?!>)[-=]?",push:"elixir-start"}];for(var t in this.$rules)this.$rules[t].unshift.apply(this.$rules[t],e);this.embedRules(s,"elixir-",[{token:"support.elixir_tag",regex:"%>",next:"pop"},{token:"comment",regex:"#(?:[^%]|%[^>])*"}],["start"]),this.normalizeRules()};l.inherits(n,r),t.HtmlElixirHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/html_elixir_highlight_rules.js.map
