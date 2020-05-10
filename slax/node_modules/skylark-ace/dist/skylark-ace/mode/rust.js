/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./rust_highlight_rules").RustHighlightRules,s=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=e,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};t.inherits(o,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/",nestable:!0},this.$quotes={'"':'"'},this.$id="ace/mode/rust"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/rust.js.map
