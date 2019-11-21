/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var h=i("../lib/oop"),o=i("./text").Mode,s=i("./vbscript_highlight_rules").VBScriptHighlightRules,l=function(){this.HighlightRules=s,this.$behaviour=this.$defaultBehaviour};h.inherits(l,o),function(){this.lineCommentStart=["'","REM"],this.$id="ace/mode/vbscript"}.call(l.prototype),t.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/vbscript.js.map
