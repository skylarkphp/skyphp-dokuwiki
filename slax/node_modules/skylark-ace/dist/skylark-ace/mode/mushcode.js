/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./text").Mode,r=e("./mushcode_highlight_rules").MushCodeRules,h=e("./folding/pythonic").FoldMode,s=e("../range").Range,u=function(){this.HighlightRules=r,this.foldingRules=new h("\\:"),this.$behaviour=this.$defaultBehaviour};i.inherits(u,o),function(){this.getNextLineIndent=function(e,t,n){var i=this.$getIndent(t),o=this.getTokenizer().getLineTokens(t,e).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==e&&(t.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var o=this.getTokenizer().getLineTokens(n.trim(),t).tokens;if(!o)return!1;do{var r=o.pop()}while(r&&("comment"==r.type||"text"==r.type&&r.value.match(/^\s+$/)));return!!r&&("keyword"==r.type&&e[r.value])},this.autoOutdent=function(e,t,n){n+=1;var i=this.$getIndent(t.getLine(n)),o=t.getTabString();i.slice(-o.length)==o&&t.remove(new s(n,i.length-o.length,n,i.length))},this.$id="ace/mode/mushcode"}.call(u.prototype),t.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/mushcode.js.map
