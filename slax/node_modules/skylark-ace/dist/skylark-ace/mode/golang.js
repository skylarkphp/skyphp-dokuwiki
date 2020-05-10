/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var t=require("../lib/oop"),e=require("./text").Mode,n=require("./golang_highlight_rules").GolangHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,o=require("./behaviour/cstyle").CstyleBehaviour,h=require("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=n,this.$outdent=new i,this.foldingRules=new h,this.$behaviour=new o};t.inherits(s,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/golang"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/golang.js.map
