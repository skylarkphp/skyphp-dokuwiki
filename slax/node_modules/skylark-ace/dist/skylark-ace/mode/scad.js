/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),s=t("./text").Mode,o=t("./scad_highlight_rules").scadHighlightRules,h=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/cstyle").CstyleBehaviour,c=t("./folding/cstyle").FoldMode,r=function(){this.HighlightRules=o,this.$outdent=new h,this.$behaviour=new u,this.foldingRules=new c};i.inherits(r,s),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t),o=s.tokens,h=s.state;if(o.length&&"comment"==o[o.length-1].type)return i;if("start"==t)(u=e.match(/^.*[\{\(\[]\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==h)return"";var u;(u=e.match(/^\s*(\/?)\*/))&&(u[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/scad"}.call(r.prototype),e.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/scad.js.map
