/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),o=t("./text").Mode,s=t("./fsl_highlight_rules").FSLHighlightRules,n=t("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=s,this.foldingRules=new n};l.inherits(h,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/fsl"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/fsl.js.map
