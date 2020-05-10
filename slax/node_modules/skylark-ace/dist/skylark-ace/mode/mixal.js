/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./mixal_highlight_rules").MixalHighlightRules,l=function(){this.HighlightRules=e};i.inherits(l,t),function(){this.$id="ace/mode/mixal",this.lineCommentStart="*"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/mixal.js.map
