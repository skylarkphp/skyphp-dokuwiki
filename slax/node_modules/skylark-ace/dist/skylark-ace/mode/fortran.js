/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./fortran_highlight_rules").FortranHighlightRules,i=require("./folding/cstyle").FoldMode,r=require("../range").Range,o=function(){this.HighlightRules=n,this.foldingRules=new i,this.$behaviour=this.$defaultBehaviour};t.inherits(o,e),function(){this.lineCommentStart="!",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),r=this.getTokenizer().getLineTokens(e,t).tokens;if(r.length&&"comment"==r[r.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var t={return:1,break:1,continue:1,RETURN:1,BREAK:1,CONTINUE:1};this.checkOutdent=function(e,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var r=this.getTokenizer().getLineTokens(n.trim(),e).tokens;if(!r)return!1;do{var o=r.pop()}while(o&&("comment"==o.type||"text"==o.type&&o.value.match(/^\s+$/)));return!!o&&("keyword"==o.type&&t[o.value])},this.autoOutdent=function(t,e,n){n+=1;var i=this.$getIndent(e.getLine(n)),o=e.getTabString();i.slice(-o.length)==o&&e.remove(new r(n,i.length-o.length,n,i.length))},this.$id="ace/mode/fortran"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/fortran.js.map
