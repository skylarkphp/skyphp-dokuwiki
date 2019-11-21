/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),h=t("./text").Mode,l=t("./forth_highlight_rules").ForthHighlightRules,n=t("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=l,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};o.inherits(s,h),function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/forth"}.call(s.prototype),i.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/forth.js.map
