/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./stylus_highlight_rules").StylusHighlightRules,o=require("./folding/coffee").FoldMode,s=function(){this.HighlightRules=e,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(s,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/stylus"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/stylus.js.map
