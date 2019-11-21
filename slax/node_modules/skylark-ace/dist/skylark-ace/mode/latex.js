/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var o=e("../lib/oop"),l=e("./text").Mode,n=e("./latex_highlight_rules").LatexHighlightRules,h=e("./behaviour/cstyle").CstyleBehaviour,s=e("./folding/latex").FoldMode,a=function(){this.HighlightRules=n,this.foldingRules=new s,this.$behaviour=new h({braces:!0})};o.inherits(a,l),function(){this.type="text",this.lineCommentStart="%",this.$id="ace/mode/latex",this.getMatching=function(e,t,i){void 0==t&&(t=e.selection.lead),"object"==typeof t&&(i=t.column,t=t.row);var o=e.getTokenAt(t,i);if(o)return"\\begin"==o.value||"\\end"==o.value?this.foldingRules.latexBlock(e,t,i,!0):void 0}}.call(a.prototype),t.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/latex.js.map
