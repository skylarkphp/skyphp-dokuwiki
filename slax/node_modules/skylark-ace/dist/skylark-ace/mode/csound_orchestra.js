/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),n=t("./text").Mode,s=t("./csound_orchestra_highlight_rules").CsoundOrchestraHighlightRules,h=function(){this.HighlightRules=s};o.inherits(h,n),function(){this.lineCommentStart=";",this.blockComment={start:"/*",end:"*/"}}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/csound_orchestra.js.map
