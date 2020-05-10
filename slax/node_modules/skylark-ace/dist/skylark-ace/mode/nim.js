/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./nim_highlight_rules").NimHighlightRules,l=require("./folding/cstyle").FoldMode,n=function(){t.call(this),this.HighlightRules=e,this.foldingRules=new l};i.inherits(n,t),function(){this.lineCommentStart="#",this.blockComment={start:"#[",end:"]#",nestable:!0},this.$id="ace/mode/nim"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/nim.js.map
