/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var s=t("../lib/oop"),o=t("./text").Mode,l=t("./jssm_highlight_rules").JSSMHighlightRules,n=t("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=l,this.foldingRules=new n};s.inherits(h,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/jssm"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/jssm.js.map
