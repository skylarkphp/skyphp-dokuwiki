/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./text").Mode,e=require("./actionscript_highlight_rules").ActionScriptHighlightRules,o=require("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=e,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};t.inherits(n,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/actionscript"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/actionscript.js.map
