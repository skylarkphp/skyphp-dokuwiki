/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("./lsl_highlight_rules").LSLHighlightRules,o=t("./matching_brace_outdent").MatchingBraceOutdent,s=(t("../range").Range,t("./text").Mode),h=t("./behaviour/cstyle").CstyleBehaviour,u=t("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=i,this.$outdent=new o,this.$behaviour=new h,this.foldingRules=new u};t("../lib/oop").inherits(l,s),function(){this.lineCommentStart=["//"],this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),s=o.tokens;o.state;if(s.length&&"comment.block.lsl"===s[s.length-1].type)return i;"start"===t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/lsl"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/lsl.js.map
