/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),r=t("./text").Mode,o=t("./fortran_highlight_rules").FortranHighlightRules,h=t("./folding/cstyle").FoldMode,s=t("../range").Range,g=function(){this.HighlightRules=o,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};i.inherits(g,r),function(){this.lineCommentStart="!",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),r=this.getTokenizer().getLineTokens(e,t).tokens;if(r.length&&"comment"==r[r.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var t={return:1,break:1,continue:1,RETURN:1,BREAK:1,CONTINUE:1};this.checkOutdent=function(e,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var r=this.getTokenizer().getLineTokens(n.trim(),e).tokens;if(!r)return!1;do{var o=r.pop()}while(o&&("comment"==o.type||"text"==o.type&&o.value.match(/^\s+$/)));return!!o&&("keyword"==o.type&&t[o.value])},this.autoOutdent=function(t,e,n){n+=1;var i=this.$getIndent(e.getLine(n)),r=e.getTabString();i.slice(-r.length)==r&&e.remove(new s(n,i.length-r.length,n,i.length))},this.$id="ace/mode/fortran"}.call(g.prototype),e.Mode=g});
//# sourceMappingURL=../sourcemaps/mode/fortran.js.map
