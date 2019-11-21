/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var s=i("../lib/oop"),o=i("./text").Mode,h=i("./nsis_highlight_rules").NSISHighlightRules,l=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};s.inherits(n,o),function(){this.lineCommentStart=[";","#"],this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/nsis"}.call(n.prototype),t.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/nsis.js.map
