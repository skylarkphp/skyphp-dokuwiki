/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var i=e("../lib/oop"),r=e("./text").Mode,h=e("./sh_highlight_rules").ShHighlightRules,o=e("../range").Range,s=e("./folding/cstyle").FoldMode,l=e("./behaviour/cstyle").CstyleBehaviour,g=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=new l};i.inherits(g,r),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var i=this.$getIndent(t),r=this.getTokenizer().getLineTokens(t,e).tokens;if(r.length&&"comment"==r[r.length-1].type)return i;"start"==e&&(t.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var r=this.getTokenizer().getLineTokens(n.trim(),t).tokens;if(!r)return!1;do{var h=r.pop()}while(h&&("comment"==h.type||"text"==h.type&&h.value.match(/^\s+$/)));return!!h&&("keyword"==h.type&&e[h.value])},this.autoOutdent=function(e,t,n){n+=1;var i=this.$getIndent(t.getLine(n)),r=t.getTabString();i.slice(-r.length)==r&&t.remove(new o(n,i.length-r.length,n,i.length))},this.$id="ace/mode/sh"}.call(g.prototype),t.Mode=g});
//# sourceMappingURL=../sourcemaps/mode/sh.js.map
