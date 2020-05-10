/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./hjson_highlight_rules").HjsonHighlightRules,o=require("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=e,this.foldingRules=new o};t.inherits(n,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/hjson"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/hjson.js.map
