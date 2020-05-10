/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,i=require("./mel_highlight_rules").MELHighlightRules,l=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=i,this.$behaviour=new l,this.foldingRules=new o};e.inherits(h,t),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/mel"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/mel.js.map
