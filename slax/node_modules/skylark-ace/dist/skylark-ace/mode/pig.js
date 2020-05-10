/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./pig_highlight_rules").PigHighlightRules,o=require("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=e,this.foldingRules=new o};i.inherits(l,t),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/pig"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/pig.js.map
