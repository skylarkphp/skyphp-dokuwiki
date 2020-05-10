/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text").Mode,t=require("./folding/coffee").FoldMode,o=require("./space_highlight_rules").SpaceHighlightRules,h=function(){this.HighlightRules=o,this.foldingRules=new t,this.$behaviour=this.$defaultBehaviour};e.inherits(h,i),function(){this.$id="ace/mode/space"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/space.js.map
