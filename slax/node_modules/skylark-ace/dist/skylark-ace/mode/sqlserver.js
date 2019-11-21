/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var o=t("../lib/oop"),l=t("./text").Mode,s=t("./sqlserver_highlight_rules").SqlHighlightRules,h=t("./folding/sqlserver").FoldMode,n=function(){this.HighlightRules=s,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};o.inherits(n,l),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.getCompletions=function(t,e,i,o){return e.$mode.$highlightRules.completions},this.$id="ace/mode/sql"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/sqlserver.js.map
