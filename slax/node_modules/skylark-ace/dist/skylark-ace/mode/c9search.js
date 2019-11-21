/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./text").Mode,c=t("./c9search_highlight_rules").C9SearchHighlightRules,u=t("./matching_brace_outdent").MatchingBraceOutdent,o=t("./folding/c9search").FoldMode,d=function(){this.HighlightRules=c,this.$outdent=new u,this.foldingRules=new o};i.inherits(d,h),function(){this.getNextLineIndent=function(t,e,n){return this.$getIndent(e)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/c9search"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/c9search.js.map
