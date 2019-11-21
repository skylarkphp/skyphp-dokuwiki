/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,l=i("./io_highlight_rules").IoHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=l,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};o.inherits(n,h),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/io"}.call(n.prototype),t.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/io.js.map
