/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),h=t("./text").Mode,u=t("./text_highlight_rules").TextHighlightRules,o=t("./tex_highlight_rules").TexHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,l=function(t){this.HighlightRules=t?u:o,this.$outdent=new s,this.$behaviour=this.$defaultBehaviour};n.inherits(l,h),function(){this.lineCommentStart="%",this.getNextLineIndent=function(t,e,i){return this.$getIndent(e)},this.allowAutoInsert=function(){return!1},this.$id="ace/mode/tex"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/tex.js.map
