/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var o=t("../lib/oop"),l=t("./text").Mode,h=(t("../tokenizer").Tokenizer,t("./logtalk_highlight_rules").LogtalkHighlightRules),n=t("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=h,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};o.inherits(s,l),function(){this.lineCommentStart="%",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/logtalk"}.call(s.prototype),i.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/logtalk.js.map
