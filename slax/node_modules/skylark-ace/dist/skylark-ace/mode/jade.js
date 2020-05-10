/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text").Mode,t=require("./jade_highlight_rules").JadeHighlightRules,o=require("./folding/coffee").FoldMode,h=function(){this.HighlightRules=t,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};e.inherits(h,i),function(){this.lineCommentStart="//",this.$id="ace/mode/jade"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/jade.js.map
