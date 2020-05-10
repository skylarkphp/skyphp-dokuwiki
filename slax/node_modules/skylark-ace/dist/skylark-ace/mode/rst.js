/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./rst_highlight_rules").RSTHighlightRules,h=function(){this.HighlightRules=e};t.inherits(h,i),function(){this.type="text",this.$id="ace/mode/rst"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/rst.js.map
