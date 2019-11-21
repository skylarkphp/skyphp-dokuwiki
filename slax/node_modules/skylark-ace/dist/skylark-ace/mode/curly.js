/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),h=t("./html").Mode,n=t("./matching_brace_outdent").MatchingBraceOutdent,o=t("./folding/html").FoldMode,u=t("./curly_highlight_rules").CurlyHighlightRules,c=function(){h.call(this),this.HighlightRules=u,this.$outdent=new n,this.foldingRules=new o};l.inherits(c,h),function(){this.$id="ace/mode/curly"}.call(c.prototype),i.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/curly.js.map
