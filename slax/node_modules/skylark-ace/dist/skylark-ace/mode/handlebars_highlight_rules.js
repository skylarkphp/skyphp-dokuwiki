/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var r=e("../lib/oop"),s=e("./html_highlight_rules").HtmlHighlightRules;function a(e,t){return t.splice(0,3),t.shift()||"start"}var o=function(){s.call(this);var e={regex:"(?={{)",push:"handlebars"};for(var t in this.$rules)this.$rules[t].unshift(e);this.$rules.handlebars=[{token:"comment.start",regex:"{{!--",push:[{token:"comment.end",regex:"--}}",next:a},{defaultToken:"comment"}]},{token:"comment.start",regex:"{{!",push:[{token:"comment.end",regex:"}}",next:a},{defaultToken:"comment"}]},{token:"support.function",regex:"{{{",push:[{token:"support.function",regex:"}}}",next:a},{token:"variable.parameter",regex:"[a-zA-Z_$][a-zA-Z0-9_$]*"}]},{token:"storage.type.start",regex:"{{[#\\^/&]?",push:[{token:"storage.type.end",regex:"}}",next:a},{token:"variable.parameter",regex:"[a-zA-Z_$][a-zA-Z0-9_$]*"}]}],this.normalizeRules()};r.inherits(o,s),t.HandlebarsHighlightRules=o});
//# sourceMappingURL=../sourcemaps/mode/handlebars_highlight_rules.js.map
