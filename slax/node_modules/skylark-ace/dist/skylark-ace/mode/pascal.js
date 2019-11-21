/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),l=t("./text").Mode,s=t("./pascal_highlight_rules").PascalHighlightRules,h=t("./folding/coffee").FoldMode,n=function(){this.HighlightRules=s,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};o.inherits(n,l),function(){this.lineCommentStart=["--","//"],this.blockComment=[{start:"(*",end:"*)"},{start:"{",end:"}"}],this.$id="ace/mode/pascal"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/pascal.js.map
