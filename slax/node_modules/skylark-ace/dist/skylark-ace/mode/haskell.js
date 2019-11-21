/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var l=i("../lib/oop"),h=i("./text").Mode,o=i("./haskell_highlight_rules").HaskellHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=o,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};l.inherits(n,h),function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/haskell"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/haskell.js.map
