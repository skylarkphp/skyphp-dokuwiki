/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),o=i("./text").Mode,h=i("./julia_highlight_rules").JuliaHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};l.inherits(n,o),function(){this.lineCommentStart="#",this.blockComment="",this.$id="ace/mode/julia"}.call(n.prototype),t.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/julia.js.map
