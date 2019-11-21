/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../../lib/oop"),o=t("./fold_mode").FoldMode,r=t("../../range").Range,g=e.FoldMode=function(t,e){this.regExpList=t,this.flag=e,this.foldingStartMarker=RegExp("^("+t.join("|")+")",this.flag)};n.inherits(g,o),function(){this.getFoldWidgetRange=function(t,e,i){for(var n=t.getLine(i),o={row:i,column:n.length},g=this.regExpList,l=1;l<=g.length;l++){var s=RegExp("^("+g.slice(0,l).join("|")+")",this.flag);if(s.test(n))break}for(var a=t.getLength();++i<a&&(n=t.getLine(i),!s.test(n)););if(i!=o.row+1)return new r(o.row,o.column,i-1,n.length)}}.call(g.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/diff.js.map
