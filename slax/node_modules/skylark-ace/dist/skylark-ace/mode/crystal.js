/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./crystal_highlight_rules").CrystalHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,s=require("../range").Range,h=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/coffee").FoldMode,l=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new h,this.foldingRules=new o};t.inherits(l,e),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t).tokens;if(s.length&&"comment"==s[s.length-1].type)return i;if("start"==t){var h=e.match(/^.*[\{\(\[]\s*$/),o=e.match(/^\s*(class|def|module)\s.*$/),l=e.match(/.*do(\s*|\s+\|.*\|\s*)$/),r=e.match(/^\s*(if|else|when)\s*/);(h||o||l||r)&&(i+=n)}return i},this.checkOutdent=function(t,e,n){return/^\s+(end|else)$/.test(e+n)||this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){var i=e.getLine(n);if(/}/.test(i))return this.$outdent.autoOutdent(e,n);var h=this.$getIndent(i),o=e.getLine(n-1),l=this.$getIndent(o),r=e.getTabString();l.length<=h.length&&h.slice(-r.length)==r&&e.remove(new s(n,h.length-r.length,n,h.length))},this.$id="ace/mode/crystal"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/crystal.js.map
