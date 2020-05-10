/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./kotlin_highlight_rules").KotlinHighlightRules,o=require("./behaviour/cstyle").CstyleBehaviour,l=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=t,this.foldingRules=new l,this.$behaviour=new o};i.inherits(h,e),function(){this.$id="ace/mode/kotlin"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/kotlin.js.map
