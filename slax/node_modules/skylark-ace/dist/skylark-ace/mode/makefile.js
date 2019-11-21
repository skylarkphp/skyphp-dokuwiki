/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var h=i("../lib/oop"),l=i("./text").Mode,o=i("./makefile_highlight_rules").MakefileHighlightRules,n=i("./folding/coffee").FoldMode,s=function(){this.HighlightRules=o,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};h.inherits(s,l),function(){this.lineCommentStart="#",this.$indentWithTabs=!0,this.$id="ace/mode/makefile"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/makefile.js.map
