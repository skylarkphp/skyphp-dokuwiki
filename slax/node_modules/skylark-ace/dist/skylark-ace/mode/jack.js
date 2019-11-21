/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),h=t("./text").Mode,o=t("./jack_highlight_rules").JackHighlightRules,u=t("./matching_brace_outdent").MatchingBraceOutdent,s=t("./behaviour/cstyle").CstyleBehaviour,c=t("./folding/cstyle").FoldMode,d=function(){this.HighlightRules=o,this.$outdent=new u,this.$behaviour=new s,this.foldingRules=new c};n.inherits(d,h),function(){this.lineCommentStart="--",this.getNextLineIndent=function(t,e,i){var n=this.$getIndent(e);"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(n+=i));return n},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/jack"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/jack.js.map
