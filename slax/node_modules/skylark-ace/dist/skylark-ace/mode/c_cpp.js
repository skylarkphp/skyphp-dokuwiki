/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,s=t("./c_cpp_highlight_rules").c_cppHighlightRules,h=t("./matching_brace_outdent").MatchingBraceOutdent,c=(t("../range").Range,t("./behaviour/cstyle").CstyleBehaviour),u=t("./folding/cstyle").FoldMode,r=function(){this.HighlightRules=s,this.$outdent=new h,this.$behaviour=new c,this.foldingRules=new u};i.inherits(r,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),s=o.tokens,h=o.state;if(s.length&&"comment"==s[s.length-1].type)return i;if("start"==t)(c=e.match(/^.*[\{\(\[]\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==h)return"";var c;(c=e.match(/^\s*(\/?)\*/))&&(c[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/c_cpp"}.call(r.prototype),e.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/c_cpp.js.map
