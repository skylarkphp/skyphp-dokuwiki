/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var o=e("../lib/oop"),h=e("./text").Mode,l=e("./folding/coffee").FoldMode,s=e("./space_highlight_rules").SpaceHighlightRules,n=function(){this.HighlightRules=s,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};o.inherits(n,h),function(){this.$id="ace/mode/space"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/space.js.map
