/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./scss_highlight_rules").ScssHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,s=require("./behaviour/css").CssBehaviour,o=require("./folding/cstyle").FoldMode,h=require("./css_completions").CssCompletions,c=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new s,this.$completer=new h,this.foldingRules=new o};t.inherits(c,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t).tokens;return s.length&&"comment"==s[s.length-1].type?i:(e.match(/^.*\{\s*$/)&&(i+=n),i)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.getCompletions=function(t,e,n,i){return this.$completer.getCompletions(t,e,n,i)},this.$id="ace/mode/scss"}.call(c.prototype),exports.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/scss.js.map
