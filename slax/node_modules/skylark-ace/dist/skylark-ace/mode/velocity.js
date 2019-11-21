/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),o=i("./html").Mode,h=i("./velocity_highlight_rules").VelocityHighlightRules,n=i("./folding/velocity").FoldMode,s=function(){o.call(this),this.HighlightRules=h,this.foldingRules=new n};l.inherits(s,o),function(){this.lineCommentStart="##",this.blockComment={start:"#*",end:"*#"},this.$id="ace/mode/velocity"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/velocity.js.map
