/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),s=t("./text").Mode,h=t("./fsharp_highlight_rules").FSharpHighlightRules,o=t("./folding/cstyle").FoldMode,n=function(){s.call(this),this.HighlightRules=h,this.foldingRules=new o};l.inherits(n,s),function(){this.lineCommentStart="//",this.blockComment={start:"(*",end:"*)",nestable:!0},this.$id="ace/mode/fsharp"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/fsharp.js.map
