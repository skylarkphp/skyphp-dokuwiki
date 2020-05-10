/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,i=(require("./javascript").Mode,require("./xml").Mode,require("./html").Mode,require("./markdown_highlight_rules").MarkdownHighlightRules),o=require("./folding/markdown").FoldMode,s=function(){this.HighlightRules=i,this.createModeDelegates({javascript:require("./javascript").Mode,html:require("./html").Mode,bash:require("./sh").Mode,sh:require("./sh").Mode,xml:require("./xml").Mode,css:require("./css").Mode}),this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};e.inherits(s,t),function(){this.type="text",this.blockComment={start:"\x3c!--",end:"--\x3e"},this.getNextLineIndent=function(e,t,i){if("listblock"==e){var o=/^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(t);if(!o)return"";var s=o[2];return s||(s=parseInt(o[3],10)+1+"."),o[1]+s+o[4]}return this.$getIndent(t)},this.$id="ace/mode/markdown"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/markdown.js.map
