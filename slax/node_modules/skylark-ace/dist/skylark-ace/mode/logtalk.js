/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=(require("../tokenizer").Tokenizer,require("./logtalk_highlight_rules").LogtalkHighlightRules),o=require("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=e,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(l,i),function(){this.lineCommentStart="%",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/logtalk"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/logtalk.js.map
