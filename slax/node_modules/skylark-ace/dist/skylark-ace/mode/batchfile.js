/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./batchfile_highlight_rules").BatchFileHighlightRules,h=require("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=e,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};i.inherits(l,t),function(){this.lineCommentStart="::",this.blockComment="",this.$id="ace/mode/batchfile"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/batchfile.js.map
