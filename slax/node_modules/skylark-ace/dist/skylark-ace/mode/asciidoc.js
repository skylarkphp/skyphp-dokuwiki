/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var n=i("../lib/oop"),o=i("./text").Mode,s=i("./asciidoc_highlight_rules").AsciidocHighlightRules,c=i("./folding/asciidoc").FoldMode,l=function(){this.HighlightRules=s,this.foldingRules=new c};n.inherits(l,o),function(){this.type="text",this.getNextLineIndent=function(i,t,e){if("listblock"==i){var n=/^((?:.+)?)([-+*][ ]+)/.exec(t);return n?new Array(n[1].length+1).join(" ")+n[2]:""}return this.$getIndent(t)},this.$id="ace/mode/asciidoc"}.call(l.prototype),t.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/asciidoc.js.map
