/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./nsis_highlight_rules").NSISHighlightRules,s=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=e,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.lineCommentStart=[";","#"],this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/nsis"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/nsis.js.map
