/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,o){"use strict";var e=i("../lib/oop"),h=i("./text").Mode,l=i("./cobol_highlight_rules").CobolHighlightRules,s=function(){this.HighlightRules=l,this.$behaviour=this.$defaultBehaviour};e.inherits(s,h),function(){this.lineCommentStart="*",this.$id="ace/mode/cobol"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/cobol.js.map
