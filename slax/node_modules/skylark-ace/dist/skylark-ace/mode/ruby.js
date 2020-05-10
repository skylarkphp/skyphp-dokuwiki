/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./ruby_highlight_rules").RubyHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,h=require("../range").Range,s=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/coffee").FoldMode,u=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new s,this.foldingRules=new o};t.inherits(u,e),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;if("start"==t){var s=e.match(/^.*[\{\(\[]\s*$/),o=e.match(/^\s*(class|def|module)\s.*$/),u=e.match(/.*do(\s*|\s+\|.*\|\s*)$/),g=e.match(/^\s*(if|else|when)\s*/);(s||o||u||g)&&(i+=n)}return i},this.checkOutdent=function(t,e,n){return/^\s+(end|else)$/.test(e+n)||this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){var i=e.getLine(n);if(/}/.test(i))return this.$outdent.autoOutdent(e,n);var s=this.$getIndent(i),o=e.getLine(n-1),u=this.$getIndent(o),g=e.getTabString();u.length<=s.length&&s.slice(-g.length)==g&&e.remove(new h(n,s.length-g.length,n,s.length))},this.$id="ace/mode/ruby"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/ruby.js.map
