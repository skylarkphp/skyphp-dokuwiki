/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,n=i("./gitignore_highlight_rules").GitignoreHighlightRules,g=function(){this.HighlightRules=n,this.$behaviour=this.$defaultBehaviour};o.inherits(g,h),function(){this.lineCommentStart="#",this.$id="ace/mode/gitignore"}.call(g.prototype),t.Mode=g});
//# sourceMappingURL=../sourcemaps/mode/gitignore.js.map
