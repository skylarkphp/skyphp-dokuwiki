/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var o=i("../lib/oop"),l=i("./text").Mode,h=i("./kotlin_highlight_rules").KotlinHighlightRules,n=i("./behaviour/cstyle").CstyleBehaviour,s=i("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=new n};o.inherits(u,l),function(){this.$id="ace/mode/kotlin"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/kotlin.js.map
