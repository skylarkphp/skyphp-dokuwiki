/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var s=e("../lib/oop"),l=e("./text").Mode,o=e("./assembly_x86_highlight_rules").AssemblyX86HighlightRules,h=e("./folding/coffee").FoldMode,n=function(){this.HighlightRules=o,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};s.inherits(n,l),function(){this.lineCommentStart=[";"],this.$id="ace/mode/assembly_x86"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/assembly_x86.js.map
