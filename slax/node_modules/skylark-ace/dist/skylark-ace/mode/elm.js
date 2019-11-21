/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var l=t("../lib/oop"),o=t("./text").Mode,h=t("./elm_highlight_rules").ElmHighlightRules,s=t("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};l.inherits(n,o),function(){this.lineCommentStart="--",this.blockComment={start:"{-",end:"-}",nestable:!0},this.$id="ace/mode/elm"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/elm.js.map
