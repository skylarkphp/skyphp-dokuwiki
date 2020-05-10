/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=require("./fold_mode").FoldMode,i=require("../../range").Range,n=exports.FoldMode=function(t,e){this.regExpList=t,this.flag=e,this.foldingStartMarker=RegExp("^("+t.join("|")+")",this.flag)};t.inherits(n,e),function(){this.getFoldWidgetRange=function(t,e,n){for(var o=t.getLine(n),r={row:n,column:o.length},g=this.regExpList,l=1;l<=g.length;l++){var s=RegExp("^("+g.slice(0,l).join("|")+")",this.flag);if(s.test(o))break}for(var a=t.getLength();++n<a&&(o=t.getLine(n),!s.test(o)););if(n!=r.row+1)return new i(r.row,r.column,n-1,o.length)}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/diff.js.map
