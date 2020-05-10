/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./lisp_highlight_rules").LispHighlightRules,h=function(){this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};i.inherits(h,t),function(){this.lineCommentStart=";",this.$id="ace/mode/lisp"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/lisp.js.map
