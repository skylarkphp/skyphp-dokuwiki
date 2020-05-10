/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./gitignore_highlight_rules").GitignoreHighlightRules,o=function(){this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.lineCommentStart="#",this.$id="ace/mode/gitignore"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/gitignore.js.map
