/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./ada_highlight_rules").AdaHighlightRules,i=require("../range").Range,h=function(){this.HighlightRules=n,this.$behaviour=this.$defaultBehaviour};t.inherits(h,e),function(){this.lineCommentStart="--",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*(begin|loop|then|is|do)\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return!!(e+n).match(/^\s*(begin|end)$/)},this.autoOutdent=function(t,e,n){var h=e.getLine(n),o=e.getLine(n-1),s=this.$getIndent(o).length;this.$getIndent(h).length<=s||e.outdentRows(new i(n,0,n+2,0))},this.$id="ace/mode/ada"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/ada.js.map
