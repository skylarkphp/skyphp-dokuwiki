/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./julia_highlight_rules").JuliaHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=e,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.lineCommentStart="#",this.blockComment="",this.$id="ace/mode/julia"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/julia.js.map
