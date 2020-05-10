/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./ini_highlight_rules").IniHighlightRules,n=require("./folding/ini").FoldMode,o=function(){this.HighlightRules=e,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.lineCommentStart=";",this.blockComment=null,this.$id="ace/mode/ini"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/ini.js.map
