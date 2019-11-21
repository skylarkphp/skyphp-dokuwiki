/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var l=i("../lib/oop"),o=i("./text").Mode,h=i("./elixir_highlight_rules").ElixirHighlightRules,n=i("./folding/coffee").FoldMode,s=function(){this.HighlightRules=h,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};l.inherits(s,o),function(){this.lineCommentStart="#",this.$id="ace/mode/elixir"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/elixir.js.map
