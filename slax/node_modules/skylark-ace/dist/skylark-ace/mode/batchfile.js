/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var h=i("../lib/oop"),l=i("./text").Mode,o=i("./batchfile_highlight_rules").BatchFileHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=o,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};h.inherits(n,l),function(){this.lineCommentStart="::",this.blockComment="",this.$id="ace/mode/batchfile"}.call(n.prototype),t.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/batchfile.js.map
