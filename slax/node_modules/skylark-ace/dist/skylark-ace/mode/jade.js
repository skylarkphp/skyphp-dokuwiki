/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var o=e("../lib/oop"),h=e("./text").Mode,l=e("./jade_highlight_rules").JadeHighlightRules,d=e("./folding/coffee").FoldMode,n=function(){this.HighlightRules=l,this.foldingRules=new d,this.$behaviour=this.$defaultBehaviour};o.inherits(n,h),function(){this.lineCommentStart="//",this.$id="ace/mode/jade"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/jade.js.map
