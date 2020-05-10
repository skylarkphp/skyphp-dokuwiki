/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules,i=require("./elixir_highlight_rules").ElixirHighlightRules,l=function(){t.call(this);var e=[{regex:"<%%|%%>",token:"constant.language.escape"},{token:"comment.start.eex",regex:"<%#",push:[{token:"comment.end.eex",regex:"%>",next:"pop",defaultToken:"comment"}]},{token:"support.elixir_tag",regex:"<%+(?!>)[-=]?",push:"elixir-start"}];for(var l in this.$rules)this.$rules[l].unshift.apply(this.$rules[l],e);this.embedRules(i,"elixir-",[{token:"support.elixir_tag",regex:"%>",next:"pop"},{token:"comment",regex:"#(?:[^%]|%[^>])*"}],["start"]),this.normalizeRules()};e.inherits(l,t),exports.HtmlElixirHighlightRules=l});
//# sourceMappingURL=../sourcemaps/mode/html_elixir_highlight_rules.js.map
