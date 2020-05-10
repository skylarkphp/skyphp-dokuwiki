/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./folding/cstyle").FoldMode,i=require("./tcl_highlight_rules").TclHighlightRules,h=require("./matching_brace_outdent").MatchingBraceOutdent,o=(require("../range").Range,function(){this.HighlightRules=i,this.$outdent=new h,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour});t.inherits(o,e),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/tcl"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/tcl.js.map
