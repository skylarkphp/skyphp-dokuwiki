/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var o=e("../lib/oop"),h=e("./text").Mode,r=e("./terraform_highlight_rules").TerraformHighlightRules,l=e("./behaviour/cstyle").CstyleBehaviour,n=e("./folding/cstyle").FoldMode,s=e("./matching_brace_outdent").MatchingBraceOutdent,a=function(){h.call(this),this.HighlightRules=r,this.$outdent=new s,this.$behaviour=new l,this.foldingRules=new n};o.inherits(a,h),function(){this.$id="ace/mode/terraform"}.call(a.prototype),t.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/terraform.js.map
