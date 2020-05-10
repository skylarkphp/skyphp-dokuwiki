/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules;function n(e,t){return t.splice(0,3),t.shift()||"start"}var r=function(){t.call(this);var e={regex:"(?={{)",push:"handlebars"};for(var r in this.$rules)this.$rules[r].unshift(e);this.$rules.handlebars=[{token:"comment.start",regex:"{{!--",push:[{token:"comment.end",regex:"--}}",next:n},{defaultToken:"comment"}]},{token:"comment.start",regex:"{{!",push:[{token:"comment.end",regex:"}}",next:n},{defaultToken:"comment"}]},{token:"support.function",regex:"{{{",push:[{token:"support.function",regex:"}}}",next:n},{token:"variable.parameter",regex:"[a-zA-Z_$][a-zA-Z0-9_$]*"}]},{token:"storage.type.start",regex:"{{[#\\^/&]?",push:[{token:"storage.type.end",regex:"}}",next:n},{token:"variable.parameter",regex:"[a-zA-Z_$][a-zA-Z0-9_$]*"}]}],this.normalizeRules()};e.inherits(r,t),exports.HandlebarsHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/handlebars_highlight_rules.js.map
