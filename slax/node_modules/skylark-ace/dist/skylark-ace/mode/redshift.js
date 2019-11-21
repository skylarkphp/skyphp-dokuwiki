/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){var n=t("../lib/oop"),h=t("../mode/text").Mode,o=t("./redshift_highlight_rules").RedshiftHighlightRules,s=(t("../range").Range,function(){this.HighlightRules=o});n.inherits(s,h),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,i){return"start"==t||"keyword.statementEnd"==t?"":this.$getIndent(e)},this.$id="ace/mode/redshift"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/redshift.js.map
