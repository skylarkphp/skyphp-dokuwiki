/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var l=e("../lib/oop"),o=e("./text").Mode,h=e("./mel_highlight_rules").MELHighlightRules,s=e("./behaviour/cstyle").CstyleBehaviour,n=e("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=h,this.$behaviour=new s,this.foldingRules=new n};l.inherits(u,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/mel"}.call(u.prototype),t.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/mel.js.map
