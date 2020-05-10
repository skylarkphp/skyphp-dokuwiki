/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./mask_highlight_rules").MaskHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,o=require("./behaviour/css").CssBehaviour,s=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new o,this.foldingRules=new s};t.inherits(h,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;return o.length&&"comment"==o[o.length-1].type?i:(e.match(/^.*\{\s*$/)&&(i+=n),i)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/mask"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/mask.js.map
