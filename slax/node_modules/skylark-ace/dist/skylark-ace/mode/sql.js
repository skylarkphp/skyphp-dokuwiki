/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var h=i("../lib/oop"),l=i("./text").Mode,o=i("./sql_highlight_rules").SqlHighlightRules,s=function(){this.HighlightRules=o,this.$behaviour=this.$defaultBehaviour};h.inherits(s,l),function(){this.lineCommentStart="--",this.$id="ace/mode/sql"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/sql.js.map
