/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,o){"use strict";var e=t("../lib/oop"),l=t("./c_cpp").Mode,n=t("./protobuf_highlight_rules").ProtobufHighlightRules,s=t("./folding/cstyle").FoldMode,h=function(){l.call(this),this.foldingRules=new s,this.HighlightRules=n};e.inherits(h,l),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/protobuf"}.call(h.prototype),i.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/protobuf.js.map
