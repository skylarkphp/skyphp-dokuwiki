/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var t=require("../lib/oop"),e=require("./text").Mode,i=require("./html").Mode,n=require("./html_completions").HtmlCompletions,o=require("./behaviour/liquid").LiquidBehaviour,h=require("./liquid_highlight_rules").LiquidHighlightRules,u=require("./matching_brace_outdent").MatchingBraceOutdent,s=function(){this.HighlightRules=h,this.$outdent=new u,this.$behaviour=new o,this.$completer=new n};t.inherits(s,e),function(){this.blockComment={start:"\x3c!--",end:"--\x3e"},this.voidElements=(new i).voidElements,this.getNextLineIndent=function(t,e,i){var n=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return n;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(n+=i));return n},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/liquid"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/liquid.js.map
