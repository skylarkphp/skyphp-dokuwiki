/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var l=e("../lib/oop"),n=e("./c_cpp").Mode,o=e("./glsl_highlight_rules").glslHighlightRules,h=e("./matching_brace_outdent").MatchingBraceOutdent,s=(e("../range").Range,e("./behaviour/cstyle").CstyleBehaviour),g=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=o,this.$outdent=new h,this.$behaviour=new s,this.foldingRules=new g};l.inherits(c,n),function(){this.$id="ace/mode/glsl"}.call(c.prototype),i.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/glsl.js.map
