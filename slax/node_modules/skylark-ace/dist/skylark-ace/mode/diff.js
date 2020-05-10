/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,f=require("./diff_highlight_rules").DiffHighlightRules,t=require("./folding/diff").FoldMode,o=function(){this.HighlightRules=f,this.foldingRules=new t(["diff","@@|\\*{5}"],"i")};i.inherits(o,e),function(){this.$id="ace/mode/diff"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/diff.js.map
