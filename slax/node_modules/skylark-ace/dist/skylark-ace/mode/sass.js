/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./sass_highlight_rules").SassHighlightRules,s=require("./folding/coffee").FoldMode,o=function(){this.HighlightRules=t,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};i.inherits(o,e),function(){this.lineCommentStart="//",this.$id="ace/mode/sass"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/sass.js.map
