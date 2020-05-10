/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,o=require("./bro_highlight_rules").BroHighlightRules,t=require("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=o,this.foldingRules=new t};i.inherits(l,e),function(){this.$id="ace/mode/bro"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/bro.js.map
