/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./sqlserver_highlight_rules").SqlHighlightRules,o=require("./folding/sqlserver").FoldMode,l=function(){this.HighlightRules=i,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(l,e),function(){this.lineCommentStart="--",this.blockComment={start:"/*",end:"*/"},this.getCompletions=function(t,e,i,o){return e.$mode.$highlightRules.completions},this.$id="ace/mode/sql"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/sqlserver.js.map
