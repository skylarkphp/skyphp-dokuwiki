/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./html_highlight_rules").HtmlHighlightRules,e=function(){i.call(this),this.$rules.start.unshift({token:"variable",regex:"{{",push:"curly-start"}),this.$rules["curly-start"]=[{token:"variable",regex:"}}",next:"pop"}],this.normalizeRules()};t.inherits(e,i),exports.CurlyHighlightRules=e});
//# sourceMappingURL=../sourcemaps/mode/curly_highlight_rules.js.map
