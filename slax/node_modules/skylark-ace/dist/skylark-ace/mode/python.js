/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,h=t("./python_highlight_rules").PythonHighlightRules,r=t("./folding/pythonic").FoldMode,s=t("../range").Range,g=function(){this.HighlightRules=h,this.foldingRules=new r("\\:"),this.$behaviour=this.$defaultBehaviour};i.inherits(g,o),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var t={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(e,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var o=this.getTokenizer().getLineTokens(n.trim(),e).tokens;if(!o)return!1;do{var h=o.pop()}while(h&&("comment"==h.type||"text"==h.type&&h.value.match(/^\s+$/)));return!!h&&("keyword"==h.type&&t[h.value])},this.autoOutdent=function(t,e,n){n+=1;var i=this.$getIndent(e.getLine(n)),o=e.getTabString();i.slice(-o.length)==o&&e.remove(new s(n,i.length-o.length,n,i.length))},this.$id="ace/mode/python"}.call(g.prototype),e.Mode=g});
//# sourceMappingURL=../sourcemaps/mode/python.js.map
