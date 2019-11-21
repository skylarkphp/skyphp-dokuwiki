/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("../lib/oop"),o=e("./javascript").Mode,s=e("./sjs_highlight_rules").SJSHighlightRules,h=e("./matching_brace_outdent").MatchingBraceOutdent,l=e("./behaviour/cstyle").CstyleBehaviour,u=e("./folding/cstyle").FoldMode,r=function(){this.HighlightRules=s,this.$outdent=new h,this.$behaviour=new l,this.foldingRules=new u};n.inherits(r,o),function(){this.createWorker=function(e){return null},this.$id="ace/mode/sjs"}.call(r.prototype),t.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/sjs.js.map
