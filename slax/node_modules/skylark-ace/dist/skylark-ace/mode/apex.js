/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var o=e("../lib/oop"),l=e("../mode/text").Mode,h=e("./apex_highlight_rules").ApexHighlightRules,s=e("../mode/folding/cstyle").FoldMode,n=e("../mode/behaviour/cstyle").CstyleBehaviour;function d(){l.call(this),this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=new n}o.inherits(d,l),d.prototype.lineCommentStart="//",d.prototype.blockComment={start:"/*",end:"*/"},t.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/apex.js.map
