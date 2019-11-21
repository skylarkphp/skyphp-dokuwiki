/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var h=t("../lib/oop"),l=t("./text").Mode,o=t("./matlab_highlight_rules").MatlabHighlightRules,a=function(){this.HighlightRules=o,this.$behaviour=this.$defaultBehaviour};h.inherits(a,l),function(){this.lineCommentStart="%",this.blockComment={start:"%{",end:"%}"},this.$id="ace/mode/matlab"}.call(a.prototype),i.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/matlab.js.map
