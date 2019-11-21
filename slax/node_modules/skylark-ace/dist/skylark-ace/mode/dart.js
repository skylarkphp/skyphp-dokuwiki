/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),o=t("./c_cpp").Mode,n=t("./dart_highlight_rules").DartHighlightRules,s=t("./folding/cstyle").FoldMode,h=function(){o.call(this),this.HighlightRules=n,this.foldingRules=new s};l.inherits(h,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/dart"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/dart.js.map
