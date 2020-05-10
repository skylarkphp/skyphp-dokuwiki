/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./c_cpp").Mode,t=require("./glsl_highlight_rules").glslHighlightRules,l=require("./matching_brace_outdent").MatchingBraceOutdent,n=(require("../range").Range,require("./behaviour/cstyle").CstyleBehaviour),o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=t,this.$outdent=new l,this.$behaviour=new n,this.foldingRules=new o};e.inherits(h,i),function(){this.$id="ace/mode/glsl"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/glsl.js.map
