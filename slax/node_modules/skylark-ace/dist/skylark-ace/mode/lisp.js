/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var h=i("../lib/oop"),s=i("./text").Mode,l=i("./lisp_highlight_rules").LispHighlightRules,o=function(){this.HighlightRules=l,this.$behaviour=this.$defaultBehaviour};h.inherits(o,s),function(){this.lineCommentStart=";",this.$id="ace/mode/lisp"}.call(o.prototype),t.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/lisp.js.map
