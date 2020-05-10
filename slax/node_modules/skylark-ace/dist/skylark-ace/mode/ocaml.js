/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./ocaml_highlight_rules").OcamlHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,o=require("../range").Range,h=function(){this.HighlightRules=n,this.$behaviour=this.$defaultBehaviour,this.$outdent=new i};t.inherits(h,e);var s=/(?:[({[=:]|[-=]>|\b(?:else|try|with))\s*$/;(function(){this.toggleCommentLines=function(t,e,n,i){var h,s,r=!0,u=/^\s*\(\*(.*)\*\)/;for(h=n;h<=i;h++)if(!u.test(e.getLine(h))){r=!1;break}var a=new o(0,0,0,0);for(h=n;h<=i;h++)s=e.getLine(h),a.start.row=h,a.end.row=h,a.end.column=s.length,e.replace(a,r?s.match(u)[1]:"(*"+s+"*)")},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;return o.length&&"comment"===o[o.length-1].type||"start"!==t||!s.test(e)||(i+=n),i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/ocaml"}).call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/ocaml.js.map
