/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){var n=t("../lib/oop"),o=t("./text").Mode,h=t("./html").Mode,u=t("./html_completions").HtmlCompletions,s=t("./behaviour/liquid").LiquidBehaviour,d=t("./liquid_highlight_rules").LiquidHighlightRules,l=t("./matching_brace_outdent").MatchingBraceOutdent,c=function(){this.HighlightRules=d,this.$outdent=new l,this.$behaviour=new s,this.$completer=new u};n.inherits(c,o),function(){this.blockComment={start:"\x3c!--",end:"--\x3e"},this.voidElements=(new h).voidElements,this.getNextLineIndent=function(t,e,i){var n=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return n;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(n+=i));return n},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/liquid"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/liquid.js.map
