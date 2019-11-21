/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(l,i,e){"use strict";var t=l("../lib/oop"),h=l("./text").Mode,o=l("./haskell_cabal_highlight_rules").CabalHighlightRules,a=l("./folding/haskell_cabal").FoldMode,s=function(){this.HighlightRules=o,this.foldingRules=new a,this.$behaviour=this.$defaultBehaviour};t.inherits(s,h),function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/haskell_cabal"}.call(s.prototype),i.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/haskell_cabal.js.map
