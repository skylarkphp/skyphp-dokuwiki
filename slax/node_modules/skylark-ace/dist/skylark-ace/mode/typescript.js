/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),o=t("./javascript").Mode,h=t("./typescript_highlight_rules").TypeScriptHighlightRules,r=t("./behaviour/cstyle").CstyleBehaviour,s=t("./folding/cstyle").FoldMode,c=t("./matching_brace_outdent").MatchingBraceOutdent,l=function(){this.HighlightRules=h,this.$outdent=new c,this.$behaviour=new r,this.foldingRules=new s};n.inherits(l,o),function(){this.createWorker=function(t){return null},this.$id="ace/mode/typescript"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/typescript.js.map
