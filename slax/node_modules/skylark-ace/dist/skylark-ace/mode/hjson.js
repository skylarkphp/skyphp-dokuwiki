/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),n=t("./text").Mode,s=t("./hjson_highlight_rules").HjsonHighlightRules,l=t("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=s,this.foldingRules=new l};o.inherits(h,n),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/hjson"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/hjson.js.map
