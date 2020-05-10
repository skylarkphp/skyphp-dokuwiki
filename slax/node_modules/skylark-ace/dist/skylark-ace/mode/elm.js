/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./elm_highlight_rules").ElmHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=i,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};t.inherits(o,e),function(){this.lineCommentStart="--",this.blockComment={start:"{-",end:"-}",nestable:!0},this.$id="ace/mode/elm"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/elm.js.map
