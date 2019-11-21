/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("./abap_highlight_rules").AbapHighlightRules,o=e("./folding/coffee").FoldMode,h=(e("../range").Range,e("./text").Mode);function l(){this.HighlightRules=n,this.foldingRules=new o}e("../lib/oop").inherits(l,h),function(){this.lineCommentStart='"',this.getNextLineIndent=function(e,t,i){return this.$getIndent(t)},this.$id="ace/mode/abap"}.call(l.prototype),t.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/abap.js.map
