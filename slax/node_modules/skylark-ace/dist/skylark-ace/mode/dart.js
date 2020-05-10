/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./c_cpp").Mode,e=require("./dart_highlight_rules").DartHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){i.call(this),this.HighlightRules=e,this.foldingRules=new l};t.inherits(o,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/dart"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/dart.js.map
