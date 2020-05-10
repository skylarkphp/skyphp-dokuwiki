/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("./abap_highlight_rules").AbapHighlightRules,t=require("./folding/coffee").FoldMode,i=(require("../range").Range,require("./text").Mode);function n(){this.HighlightRules=e,this.foldingRules=new t}require("../lib/oop").inherits(n,i),function(){this.lineCommentStart='"',this.getNextLineIndent=function(e,t,i){return this.$getIndent(t)},this.$id="ace/mode/abap"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/abap.js.map
