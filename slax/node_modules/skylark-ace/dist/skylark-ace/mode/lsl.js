/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("./lsl_highlight_rules").LSLHighlightRules,e=require("./matching_brace_outdent").MatchingBraceOutdent,n=(require("../range").Range,require("./text").Mode),i=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=t,this.$outdent=new e,this.$behaviour=new i,this.foldingRules=new o};require("../lib/oop").inherits(s,n),function(){this.lineCommentStart=["//"],this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),s=o.tokens;o.state;if(s.length&&"comment.block.lsl"===s[s.length-1].type)return i;"start"===t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/lsl"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/lsl.js.map
