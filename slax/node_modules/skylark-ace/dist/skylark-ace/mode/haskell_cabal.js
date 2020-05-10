/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var l=require("../lib/oop"),i=require("./text").Mode,e=require("./haskell_cabal_highlight_rules").CabalHighlightRules,t=require("./folding/haskell_cabal").FoldMode,h=function(){this.HighlightRules=e,this.foldingRules=new t,this.$behaviour=this.$defaultBehaviour};l.inherits(h,i),function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/haskell_cabal"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/haskell_cabal.js.map
