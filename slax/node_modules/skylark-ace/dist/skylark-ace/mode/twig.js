/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./html").Mode,o=t("./twig_highlight_rules").TwigHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,u=function(){h.call(this),this.HighlightRules=o,this.$outdent=new s};i.inherits(u,h),function(){this.blockComment={start:"{#",end:"#}"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t),o=h.tokens;h.state;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/twig"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/twig.js.map
