/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),s=t("./text").Mode,l=t("./stylus_highlight_rules").StylusHighlightRules,h=t("./folding/coffee").FoldMode,n=function(){this.HighlightRules=l,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};o.inherits(n,s),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/stylus"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/stylus.js.map
