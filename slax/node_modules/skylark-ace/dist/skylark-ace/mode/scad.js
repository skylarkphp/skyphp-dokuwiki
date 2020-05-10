/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./scad_highlight_rules").scadHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,s=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=n,this.$outdent=new i,this.$behaviour=new s,this.foldingRules=new o};t.inherits(h,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t),o=s.tokens,h=s.state;if(o.length&&"comment"==o[o.length-1].type)return i;if("start"==t)(u=e.match(/^.*[\{\(\[]\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==h)return"";var u;(u=e.match(/^\s*(\/?)\*/))&&(u[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/scad"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/scad.js.map
