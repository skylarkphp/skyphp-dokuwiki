/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./forth_highlight_rules").ForthHighlightRules,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=e,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(h,i),function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/forth"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/forth.js.map
