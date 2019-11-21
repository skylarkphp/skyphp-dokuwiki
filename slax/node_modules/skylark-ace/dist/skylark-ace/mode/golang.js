/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){var i=t("../lib/oop"),o=t("./text").Mode,h=t("./golang_highlight_rules").GolangHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/cstyle").CstyleBehaviour,l=t("./folding/cstyle").FoldMode,a=function(){this.HighlightRules=h,this.$outdent=new s,this.foldingRules=new l,this.$behaviour=new u};i.inherits(a,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/golang"}.call(a.prototype),e.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/golang.js.map
