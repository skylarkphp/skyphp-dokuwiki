/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./asl_highlight_rules").ASLHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=t,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};i.inherits(o,e),function(){this.$id="ace/mode/asl"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/asl.js.map
