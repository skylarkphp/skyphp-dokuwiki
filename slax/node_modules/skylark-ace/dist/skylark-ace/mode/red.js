/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./red_highlight_rules").RedHighlightRules,i=require("./folding/cstyle").FoldMode,o=require("./matching_brace_outdent").MatchingBraceOutdent,h=(require("../range").Range,function(){this.HighlightRules=n,this.foldingRules=new i,this.$outdent=new o,this.$behaviour=this.$defaultBehaviour});t.inherits(h,e),function(){this.lineCommentStart=";",this.blockComment={start:"comment {",end:"}"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),h=o.tokens,s=o.state;if(h.length&&"comment"==h[h.length-1].type)return i;if("start"==t)(u=e.match(/^.*[\{\[\(]\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==s)return"";var u;(u=e.match(/^\s*(\/?)\*/))&&(u[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/red"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/red.js.map
