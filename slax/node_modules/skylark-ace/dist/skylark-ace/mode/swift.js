/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),s=t("./text").Mode,h=t("./swift_highlight_rules").HighlightRules,l=t("./behaviour/cstyle").CstyleBehaviour,n=t("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=h,this.foldingRules=new n,this.$behaviour=new l,this.$behaviour=this.$defaultBehaviour};o.inherits(u,s),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/",nestable:!0},this.$id="ace/mode/swift"}.call(u.prototype),i.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/swift.js.map
