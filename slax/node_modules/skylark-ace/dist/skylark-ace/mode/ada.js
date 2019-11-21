/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./text").Mode,o=t("./ada_highlight_rules").AdaHighlightRules,s=t("../range").Range,g=function(){this.HighlightRules=o,this.$behaviour=this.$defaultBehaviour};i.inherits(g,h),function(){this.lineCommentStart="--",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*(begin|loop|then|is|do)\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return!!(e+n).match(/^\s*(begin|end)$/)},this.autoOutdent=function(t,e,n){var i=e.getLine(n),h=e.getLine(n-1),o=this.$getIndent(h).length;this.$getIndent(i).length<=o||e.outdentRows(new s(n,0,n+2,0))},this.$id="ace/mode/ada"}.call(g.prototype),e.Mode=g});
//# sourceMappingURL=../sourcemaps/mode/ada.js.map
