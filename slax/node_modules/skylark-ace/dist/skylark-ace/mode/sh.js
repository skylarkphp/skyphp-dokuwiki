/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,n=require("./sh_highlight_rules").ShHighlightRules,i=require("../range").Range,r=require("./folding/cstyle").FoldMode,h=require("./behaviour/cstyle").CstyleBehaviour,o=function(){this.HighlightRules=n,this.foldingRules=new r,this.$behaviour=new h};e.inherits(o,t),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var i=this.$getIndent(t),r=this.getTokenizer().getLineTokens(t,e).tokens;if(r.length&&"comment"==r[r.length-1].type)return i;"start"==e&&(t.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,i){if("\r\n"!==i&&"\r"!==i&&"\n"!==i)return!1;var r=this.getTokenizer().getLineTokens(n.trim(),t).tokens;if(!r)return!1;do{var h=r.pop()}while(h&&("comment"==h.type||"text"==h.type&&h.value.match(/^\s+$/)));return!!h&&("keyword"==h.type&&e[h.value])},this.autoOutdent=function(e,t,n){n+=1;var r=this.$getIndent(t.getLine(n)),h=t.getTabString();r.slice(-h.length)==h&&t.remove(new i(n,r.length-h.length,n,r.length))},this.$id="ace/mode/sh"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/sh.js.map
