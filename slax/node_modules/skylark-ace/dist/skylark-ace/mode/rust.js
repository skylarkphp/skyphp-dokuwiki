/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var s=t("../lib/oop"),o=t("./text").Mode,h=t("./rust_highlight_rules").RustHighlightRules,l=t("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};s.inherits(n,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/",nestable:!0},this.$quotes={'"':'"'},this.$id="ace/mode/rust"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/rust.js.map
