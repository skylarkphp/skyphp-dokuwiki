/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,i=require("./latex_highlight_rules").LatexHighlightRules,o=require("./behaviour/cstyle").CstyleBehaviour,l=require("./folding/latex").FoldMode,n=function(){this.HighlightRules=i,this.foldingRules=new l,this.$behaviour=new o({braces:!0})};e.inherits(n,t),function(){this.type="text",this.lineCommentStart="%",this.$id="ace/mode/latex",this.getMatching=function(e,t,i){void 0==t&&(t=e.selection.lead),"object"==typeof t&&(i=t.column,t=t.row);var o=e.getTokenAt(t,i);if(o)return"\\begin"==o.value||"\\end"==o.value?this.foldingRules.latexBlock(e,t,i,!0):void 0}}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/latex.js.map
