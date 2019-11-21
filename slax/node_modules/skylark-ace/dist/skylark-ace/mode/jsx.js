/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,h=t("./jsx_highlight_rules").JsxHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/cstyle").CstyleBehaviour,c=t("./folding/cstyle").FoldMode;function d(){this.HighlightRules=h,this.$outdent=new s,this.$behaviour=new u,this.foldingRules=new c}i.inherits(d,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/jsx"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/jsx.js.map
