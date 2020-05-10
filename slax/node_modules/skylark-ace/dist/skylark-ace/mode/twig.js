/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./html").Mode,n=require("./twig_highlight_rules").TwigHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,h=function(){e.call(this),this.HighlightRules=n,this.$outdent=new i};t.inherits(h,e),function(){this.blockComment={start:"{#",end:"#}"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t),o=h.tokens;h.state;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/twig"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/twig.js.map
