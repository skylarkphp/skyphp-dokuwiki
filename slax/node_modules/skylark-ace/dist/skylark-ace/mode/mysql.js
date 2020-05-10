/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var t=require("../lib/oop"),i=require("../mode/text").Mode,e=require("./mysql_highlight_rules").MysqlHighlightRules,h=function(){this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};t.inherits(h,i),function(){this.lineCommentStart=["--","#"],this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/mysql"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/mysql.js.map
