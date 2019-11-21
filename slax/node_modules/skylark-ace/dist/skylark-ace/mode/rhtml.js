/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var n=t("../lib/oop"),o=t("./html").Mode,s=t("./rhtml_highlight_rules").RHtmlHighlightRules,h=function(t,i){o.call(this),this.$session=i,this.HighlightRules=s};n.inherits(h,o),function(){this.insertChunkInfo={value:"\x3c!--begin.rcode\n\nend.rcode--\x3e\n",position:{row:0,column:15}},this.getLanguageMode=function(t){return this.$session.getState(t.row).match(/^r-/)?"R":"HTML"},this.$id="ace/mode/rhtml"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/rhtml.js.map
