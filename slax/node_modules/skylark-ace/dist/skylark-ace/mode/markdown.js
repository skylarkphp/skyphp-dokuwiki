/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var o=e("../lib/oop"),s=e("./text").Mode,d=(e("./javascript").Mode,e("./xml").Mode,e("./html").Mode,e("./markdown_highlight_rules").MarkdownHighlightRules),n=e("./folding/markdown").FoldMode,h=function(){this.HighlightRules=d,this.createModeDelegates({javascript:e("./javascript").Mode,html:e("./html").Mode,bash:e("./sh").Mode,sh:e("./sh").Mode,xml:e("./xml").Mode,css:e("./css").Mode}),this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};o.inherits(h,s),function(){this.type="text",this.blockComment={start:"\x3c!--",end:"--\x3e"},this.getNextLineIndent=function(e,t,i){if("listblock"==e){var o=/^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(t);if(!o)return"";var s=o[2];return s||(s=parseInt(o[3],10)+1+"."),o[1]+s+o[4]}return this.$getIndent(t)},this.$id="ace/mode/markdown"}.call(h.prototype),t.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/markdown.js.map
