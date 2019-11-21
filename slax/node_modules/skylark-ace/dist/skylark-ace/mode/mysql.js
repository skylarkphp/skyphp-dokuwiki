/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){var h=t("../lib/oop"),o=t("../mode/text").Mode,l=t("./mysql_highlight_rules").MysqlHighlightRules,s=function(){this.HighlightRules=l,this.$behaviour=this.$defaultBehaviour};h.inherits(s,o),function(){this.lineCommentStart=["--","#"],this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/mysql"}.call(s.prototype),i.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/mysql.js.map
