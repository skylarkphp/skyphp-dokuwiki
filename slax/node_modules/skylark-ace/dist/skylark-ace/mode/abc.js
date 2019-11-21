/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,l=i("./abc_highlight_rules").ABCHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=l,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};o.inherits(n,h),function(){this.$id="ace/mode/abc"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/abc.js.map
