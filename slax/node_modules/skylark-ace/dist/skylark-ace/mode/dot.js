/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./matching_brace_outdent").MatchingBraceOutdent,i=require("./dot_highlight_rules").DotHighlightRules,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=i,this.$outdent=new n,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(h,e),function(){this.lineCommentStart=["//","#"],this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens;o.state;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/dot"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/dot.js.map
