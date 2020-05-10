/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=(require("../tokenizer").Tokenizer,require("./vala_highlight_rules").ValaHighlightRules),i=(require("./folding/cstyle").FoldMode,require("./behaviour/cstyle").CstyleBehaviour),o=require("./folding/cstyle").FoldMode,s=require("./matching_brace_outdent").MatchingBraceOutdent,h=function(){this.HighlightRules=n,this.$outdent=new s,this.$behaviour=new i,this.foldingRules=new o};t.inherits(h,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),s=o.tokens,h=o.state;if(s.length&&"comment"==s[s.length-1].type)return i;if("start"==t||"no_regex"==t)(r=e.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==h||"no_regex"==h)return"";var r;(r=e.match(/^\s*(\/?)\*/))&&(r[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/vala"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/vala.js.map
