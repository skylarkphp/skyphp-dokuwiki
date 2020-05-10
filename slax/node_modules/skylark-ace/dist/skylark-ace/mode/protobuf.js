/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./c_cpp").Mode,o=require("./protobuf_highlight_rules").ProtobufHighlightRules,e=require("./folding/cstyle").FoldMode,l=function(){i.call(this),this.foldingRules=new e,this.HighlightRules=o};t.inherits(l,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/protobuf"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/protobuf.js.map
