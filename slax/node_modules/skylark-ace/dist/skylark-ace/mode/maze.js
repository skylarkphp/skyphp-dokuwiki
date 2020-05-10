/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./maze_highlight_rules").MazeHighlightRules,o=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=t,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};i.inherits(h,e),function(){this.lineCommentStart="//",this.$id="ace/mode/maze"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/maze.js.map
