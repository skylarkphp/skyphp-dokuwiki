/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,h=t("./matching_brace_outdent").MatchingBraceOutdent,s=t("./dot_highlight_rules").DotHighlightRules,u=t("./folding/cstyle").FoldMode,d=function(){this.HighlightRules=s,this.$outdent=new h,this.foldingRules=new u,this.$behaviour=this.$defaultBehaviour};i.inherits(d,o),function(){this.lineCommentStart=["//","#"],this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/dot"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/dot.js.map
