/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),i=require("./fold_mode").FoldMode,n=exports.FoldMode=function(t){this.foldingStartMarker=new RegExp("([\\[{])(?:\\s*)$|("+t+")(?:\\s*)(?:#.*)?$")};t.inherits(n,i),function(){this.getFoldWidgetRange=function(t,i,n){var e=t.getLine(n).match(this.foldingStartMarker);if(e)return e[1]?this.openingBracketBlock(t,e[1],n,e.index):e[2]?this.indentationBlock(t,n,e.index+e[2].length):this.indentationBlock(t,n)}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/pythonic.js.map
