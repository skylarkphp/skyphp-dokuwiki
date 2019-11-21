/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var o=e("../lib/oop"),h=e("./text").Mode,n=e("./jsp_highlight_rules").JspHighlightRules,s=e("./matching_brace_outdent").MatchingBraceOutdent,l=e("./behaviour/cstyle").CstyleBehaviour,u=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=n,this.$outdent=new s,this.$behaviour=new l,this.foldingRules=new u};o.inherits(c,h),function(){this.$id="ace/mode/jsp"}.call(c.prototype),t.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/jsp.js.map
