/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text").Mode,t=require("./assembly_x86_highlight_rules").AssemblyX86HighlightRules,s=require("./folding/coffee").FoldMode,l=function(){this.HighlightRules=t,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};e.inherits(l,i),function(){this.lineCommentStart=[";"],this.$id="ace/mode/assembly_x86"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/assembly_x86.js.map
