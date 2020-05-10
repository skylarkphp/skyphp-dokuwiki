/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./asciidoc_highlight_rules").AsciidocHighlightRules,n=require("./folding/asciidoc").FoldMode,o=function(){this.HighlightRules=e,this.foldingRules=new n};i.inherits(o,t),function(){this.type="text",this.getNextLineIndent=function(i,t,e){if("listblock"==i){var n=/^((?:.+)?)([-+*][ ]+)/.exec(t);return n?new Array(n[1].length+1).join(" ")+n[2]:""}return this.$getIndent(t)},this.$id="ace/mode/asciidoc"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/asciidoc.js.map
