/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),h=t("./text").Mode,o=t("./rdoc_highlight_rules").RDocHighlightRules,u=t("./matching_brace_outdent").MatchingBraceOutdent,c=function(t){this.HighlightRules=o,this.$outdent=new u,this.$behaviour=this.$defaultBehaviour};n.inherits(c,h),function(){this.getNextLineIndent=function(t,e,i){return this.$getIndent(e)},this.$id="ace/mode/rdoc"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/rdoc.js.map
