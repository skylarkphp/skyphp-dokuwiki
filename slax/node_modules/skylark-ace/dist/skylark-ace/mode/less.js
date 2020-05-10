/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./less_highlight_rules").LessHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,s=require("./behaviour/css").CssBehaviour,o=require("./css_completions").CssCompletions,h=require("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new s,this.$completer=new o,this.foldingRules=new h};t.inherits(u,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t).tokens;return s.length&&"comment"==s[s.length-1].type?i:(e.match(/^.*\{\s*$/)&&(i+=n),i)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.getCompletions=function(t,e,n,i){return this.$completer.getCompletions("ruleset",e,n,i)},this.$id="ace/mode/less"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/less.js.map
