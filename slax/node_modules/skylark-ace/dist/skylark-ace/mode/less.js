/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),s=t("./text").Mode,o=t("./less_highlight_rules").LessHighlightRules,h=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/css").CssBehaviour,c=t("./css_completions").CssCompletions,l=t("./folding/cstyle").FoldMode,r=function(){this.HighlightRules=o,this.$outdent=new h,this.$behaviour=new u,this.$completer=new c,this.foldingRules=new l};i.inherits(r,s),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t).tokens;return s.length&&"comment"==s[s.length-1].type?i:(e.match(/^.*\{\s*$/)&&(i+=n),i)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.getCompletions=function(t,e,n,i){return this.$completer.getCompletions("ruleset",e,n,i)},this.$id="ace/mode/less"}.call(r.prototype),e.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/less.js.map
