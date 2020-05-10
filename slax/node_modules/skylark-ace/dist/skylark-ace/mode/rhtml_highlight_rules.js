/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./r_highlight_rules").RHighlightRules,i=require("./html_highlight_rules").HtmlHighlightRules,s=require("./text_highlight_rules").TextHighlightRules,h=function(){i.call(this),this.$rules.start.unshift({token:"support.function.codebegin",regex:"^\x3c!--\\s*begin.rcode\\s*(?:.*)",next:"r-start"}),this.embedRules(e,"r-",[{token:"support.function.codeend",regex:"^\\s*end.rcode\\s*--\x3e",next:"start"}],["start"]),this.normalizeRules()};t.inherits(h,s),exports.RHtmlHighlightRules=h});
//# sourceMappingURL=../sourcemaps/mode/rhtml_highlight_rules.js.map
