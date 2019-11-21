/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),n=i("./text").Mode,o=i("./nim_highlight_rules").NimHighlightRules,s=i("./folding/cstyle").FoldMode,h=function(){n.call(this),this.HighlightRules=o,this.foldingRules=new s};l.inherits(h,n),function(){this.lineCommentStart="#",this.blockComment={start:"#[",end:"]#",nestable:!0},this.$id="ace/mode/nim"}.call(h.prototype),t.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/nim.js.map
