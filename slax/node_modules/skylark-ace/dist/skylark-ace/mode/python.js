/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./python_highlight_rules").PythonHighlightRules,i=require("./folding/pythonic").FoldMode,o=require("../range").Range,h=function(){this.HighlightRules=n,this.foldingRules=new i("\\:"),this.$behaviour=this.$defaultBehaviour};t.inherits(h,e),function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var t={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(e,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var o=this.getTokenizer().getLineTokens(n.trim(),e).tokens;if(!o)return!1;do{var h=o.pop()}while(h&&("comment"==h.type||"text"==h.type&&h.value.match(/^\s+$/)));return!!h&&("keyword"==h.type&&t[h.value])},this.autoOutdent=function(t,e,n){n+=1;var i=this.$getIndent(e.getLine(n)),h=e.getTabString();i.slice(-h.length)==h&&e.remove(new o(n,i.length-h.length,n,i.length))},this.$id="ace/mode/python"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/python.js.map
