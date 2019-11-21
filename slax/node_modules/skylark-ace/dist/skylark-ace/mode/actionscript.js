/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),n=t("./text").Mode,s=t("./actionscript_highlight_rules").ActionScriptHighlightRules,h=t("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=s,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};o.inherits(l,n),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/actionscript"}.call(l.prototype),i.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/actionscript.js.map
