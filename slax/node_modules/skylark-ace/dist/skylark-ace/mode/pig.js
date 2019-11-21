/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),l=i("./text").Mode,n=i("./pig_highlight_rules").PigHighlightRules,s=i("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=n,this.foldingRules=new s};o.inherits(h,l),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/pig"}.call(h.prototype),t.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/pig.js.map
