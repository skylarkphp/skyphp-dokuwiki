/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,o=require("./cobol_highlight_rules").CobolHighlightRules,e=function(){this.HighlightRules=o,this.$behaviour=this.$defaultBehaviour};i.inherits(e,t),function(){this.lineCommentStart="*",this.$id="ace/mode/cobol"}.call(e.prototype),exports.Mode=e});
//# sourceMappingURL=../sourcemaps/mode/cobol.js.map
