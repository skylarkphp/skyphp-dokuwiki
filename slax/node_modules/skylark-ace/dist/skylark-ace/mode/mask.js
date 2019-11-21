/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,s=t("./mask_highlight_rules").MaskHighlightRules,h=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/css").CssBehaviour,c=t("./folding/cstyle").FoldMode,d=function(){this.HighlightRules=s,this.$outdent=new h,this.$behaviour=new u,this.foldingRules=new c};i.inherits(d,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;return o.length&&"comment"==o[o.length-1].type?i:(e.match(/^.*\{\s*$/)&&(i+=n),i)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/mask"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/mask.js.map
