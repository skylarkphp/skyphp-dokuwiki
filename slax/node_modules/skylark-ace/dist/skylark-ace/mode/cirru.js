/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,l=i("./cirru_highlight_rules").CirruHighlightRules,r=i("./folding/coffee").FoldMode,u=function(){this.HighlightRules=l,this.foldingRules=new r,this.$behaviour=this.$defaultBehaviour};o.inherits(u,h),function(){this.lineCommentStart="--",this.$id="ace/mode/cirru"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/cirru.js.map
