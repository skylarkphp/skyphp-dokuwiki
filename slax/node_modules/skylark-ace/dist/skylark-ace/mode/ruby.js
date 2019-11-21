/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./text").Mode,s=t("./ruby_highlight_rules").RubyHighlightRules,o=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("../range").Range,g=t("./behaviour/cstyle").CstyleBehaviour,r=t("./folding/coffee").FoldMode,l=function(){this.HighlightRules=s,this.$outdent=new o,this.$behaviour=new g,this.foldingRules=new r};i.inherits(l,h),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;if("start"==t){var s=e.match(/^.*[\{\(\[]\s*$/),o=e.match(/^\s*(class|def|module)\s.*$/),u=e.match(/.*do(\s*|\s+\|.*\|\s*)$/),g=e.match(/^\s*(if|else|when)\s*/);(s||o||u||g)&&(i+=n)}return i},this.checkOutdent=function(t,e,n){return/^\s+(end|else)$/.test(e+n)||this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){var i=e.getLine(n);if(/}/.test(i))return this.$outdent.autoOutdent(e,n);var h=this.$getIndent(i),s=e.getLine(n-1),o=this.$getIndent(s),g=e.getTabString();o.length<=h.length&&h.slice(-g.length)==g&&e.remove(new u(n,h.length-g.length,n,h.length))},this.$id="ace/mode/ruby"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/ruby.js.map
