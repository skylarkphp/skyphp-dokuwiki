/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./matlab_highlight_rules").MatlabHighlightRules,h=function(){this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};t.inherits(h,i),function(){this.lineCommentStart="%",this.blockComment={start:"%{",end:"%}"},this.$id="ace/mode/matlab"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/matlab.js.map
