/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./vhdl_highlight_rules").VHDLHighlightRules,h=function(){this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};i.inherits(h,t),function(){this.lineCommentStart="--",this.$id="ace/mode/vhdl"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/vhdl.js.map
