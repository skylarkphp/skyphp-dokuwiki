/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,n){"use strict";var e=t("../../lib/oop"),o=t("./fold_mode").FoldMode,d=i.FoldMode=function(t){this.foldingStartMarker=new RegExp("([\\[{])(?:\\s*)$|("+t+")(?:\\s*)(?:#.*)?$")};e.inherits(d,o),function(){this.getFoldWidgetRange=function(t,i,n){var e=t.getLine(n).match(this.foldingStartMarker);if(e)return e[1]?this.openingBracketBlock(t,e[1],n,e.index):e[2]?this.indentationBlock(t,n,e.index+e[2].length):this.indentationBlock(t,n)}}.call(d.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/pythonic.js.map
