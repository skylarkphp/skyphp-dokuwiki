/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./fsharp_highlight_rules").FSharpHighlightRules,l=require("./folding/cstyle").FoldMode,s=function(){i.call(this),this.HighlightRules=e,this.foldingRules=new l};t.inherits(s,i),function(){this.lineCommentStart="//",this.blockComment={start:"(*",end:"*)",nestable:!0},this.$id="ace/mode/fsharp"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/fsharp.js.map
