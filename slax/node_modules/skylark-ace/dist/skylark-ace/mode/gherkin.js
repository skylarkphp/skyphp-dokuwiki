/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var e=require("../lib/oop"),t=require("./text").Mode,i=require("./gherkin_highlight_rules").GherkinHighlightRules,n=function(){this.HighlightRules=i,this.$behaviour=this.$defaultBehaviour};e.inherits(n,t),function(){this.lineCommentStart="#",this.$id="ace/mode/gherkin",this.getNextLineIndent=function(e,t,i){var n=this.$getIndent(t),h=this.getTokenizer().getLineTokens(t,e).tokens;return console.log(e),t.match("[ ]*\\|")&&(n+="| "),h.length&&"comment"==h[h.length-1].type?n:("start"==e&&(t.match("Scenario:|Feature:|Scenario Outline:|Background:")?n+="  ":t.match("(Given|Then).+(:)$|Examples:")?n+="  ":t.match("\\*.+")&&(n+="* ")),n)}}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/gherkin.js.map
