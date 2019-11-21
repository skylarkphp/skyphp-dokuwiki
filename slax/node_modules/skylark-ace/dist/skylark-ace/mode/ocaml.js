/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,h=t("./ocaml_highlight_rules").OcamlHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,r=t("../range").Range,u=function(){this.HighlightRules=h,this.$behaviour=this.$defaultBehaviour,this.$outdent=new s};i.inherits(u,o);var a=/(?:[({[=:]|[-=]>|\b(?:else|try|with))\s*$/;(function(){this.toggleCommentLines=function(t,e,n,i){var o,h,s=!0,u=/^\s*\(\*(.*)\*\)/;for(o=n;o<=i;o++)if(!u.test(e.getLine(o))){s=!1;break}var a=new r(0,0,0,0);for(o=n;o<=i;o++)h=e.getLine(o),a.start.row=o,a.end.row=o,a.end.column=h.length,e.replace(a,s?h.match(u)[1]:"(*"+h+"*)")},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;return o.length&&"comment"===o[o.length-1].type||"start"!==t||!a.test(e)||(i+=n),i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/ocaml"}).call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/ocaml.js.map
