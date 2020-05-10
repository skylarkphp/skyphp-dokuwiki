/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./objectivec_highlight_rules").ObjectiveCHighlightRules,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=i,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(h,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/objectivec"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/objectivec.js.map
