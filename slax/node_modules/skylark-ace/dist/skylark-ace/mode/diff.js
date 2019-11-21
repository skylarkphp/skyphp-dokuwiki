/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,f){"use strict";var t=i("../lib/oop"),o=i("./text").Mode,d=i("./diff_highlight_rules").DiffHighlightRules,l=i("./folding/diff").FoldMode,h=function(){this.HighlightRules=d,this.foldingRules=new l(["diff","@@|\\*{5}"],"i")};t.inherits(h,o),function(){this.$id="ace/mode/diff"}.call(h.prototype),e.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/diff.js.map
