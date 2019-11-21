/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),s=t("./text").Mode,h=t("./crystal_highlight_rules").CrystalHighlightRules,o=t("./matching_brace_outdent").MatchingBraceOutdent,l=t("../range").Range,r=t("./behaviour/cstyle").CstyleBehaviour,g=t("./folding/coffee").FoldMode,u=function(){this.HighlightRules=h,this.$outdent=new o,this.$behaviour=new r,this.foldingRules=new g};i.inherits(u,s),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t).tokens;if(s.length&&"comment"==s[s.length-1].type)return i;if("start"==t){var h=e.match(/^.*[\{\(\[]\s*$/),o=e.match(/^\s*(class|def|module)\s.*$/),l=e.match(/.*do(\s*|\s+\|.*\|\s*)$/),r=e.match(/^\s*(if|else|when)\s*/);(h||o||l||r)&&(i+=n)}return i},this.checkOutdent=function(t,e,n){return/^\s+(end|else)$/.test(e+n)||this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){var i=e.getLine(n);if(/}/.test(i))return this.$outdent.autoOutdent(e,n);var s=this.$getIndent(i),h=e.getLine(n-1),o=this.$getIndent(h),r=e.getTabString();o.length<=s.length&&s.slice(-r.length)==r&&e.remove(new l(n,s.length-r.length,n,s.length))},this.$id="ace/mode/crystal"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/crystal.js.map
