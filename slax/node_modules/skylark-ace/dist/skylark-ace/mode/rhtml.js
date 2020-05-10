/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./html").Mode,e=require("./rhtml_highlight_rules").RHtmlHighlightRules,n=function(t,n){i.call(this),this.$session=n,this.HighlightRules=e};t.inherits(n,i),function(){this.insertChunkInfo={value:"\x3c!--begin.rcode\n\nend.rcode--\x3e\n",position:{row:0,column:15}},this.getLanguageMode=function(t){return this.$session.getState(t.row).match(/^r-/)?"R":"HTML"},this.$id="ace/mode/rhtml"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/rhtml.js.map
