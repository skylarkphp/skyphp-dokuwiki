/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){var n=e("../lib/oop"),h=e("./text").Mode,o=e("./gherkin_highlight_rules").GherkinHighlightRules,r=function(){this.HighlightRules=o,this.$behaviour=this.$defaultBehaviour};n.inherits(r,h),function(){this.lineCommentStart="#",this.$id="ace/mode/gherkin",this.getNextLineIndent=function(e,t,i){var n=this.$getIndent(t),h=this.getTokenizer().getLineTokens(t,e).tokens;return console.log(e),t.match("[ ]*\\|")&&(n+="| "),h.length&&"comment"==h[h.length-1].type?n:("start"==e&&(t.match("Scenario:|Feature:|Scenario Outline:|Background:")?n+="  ":t.match("(Given|Then).+(:)$|Examples:")?n+="  ":t.match("\\*.+")&&(n+="* ")),n)}}.call(r.prototype),t.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/gherkin.js.map
