/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text").Mode,t=require("./gcode_highlight_rules").GcodeHighlightRules,o=(require("../range").Range,function(){this.HighlightRules=t,this.$behaviour=this.$defaultBehaviour});e.inherits(o,i),function(){this.$id="ace/mode/gcode"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/gcode.js.map
