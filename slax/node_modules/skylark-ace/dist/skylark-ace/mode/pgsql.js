/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var t=require("../lib/oop"),e=require("../mode/text").Mode,i=require("./pgsql_highlight_rules").PgsqlHighlightRules,n=function(){this.HighlightRules=i,this.$behaviour=this.$defaultBehaviour};t.inherits(n,e),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,i){return"start"==t||"keyword.statementEnd"==t?"":this.$getIndent(e)},this.$id="ace/mode/pgsql"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/pgsql.js.map
