/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var i=e("../../lib/oop"),o=e("../../range").Range,r=e("./cstyle").FoldMode,g=t.FoldMode=function(){};i.inherits(g,r),function(){this.foldingStartMarker=/(\bCASE\b|\bBEGIN\b)|^\s*(\/\*)/i,this.startRegionRe=/^\s*(\/\*|--)#?region\b/,this.getFoldWidgetRange=function(e,t,n,i){var o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);var r=o.match(this.foldingStartMarker);if(r){var g=r.index;if(r[1])return this.getBeginEndBlock(e,n,g,r[1]);var l=e.getCommentFoldRange(n,g+r[0].length,1);return l&&!l.isMultiLine()&&(i?l=this.getSectionRange(e,n):"all"!=t&&(l=null)),l}},this.getBeginEndBlock=function(e,t,n,i){for(var r,g={row:t,column:n+i.length},l=e.getLength(),a=1,s=/(\bCASE\b|\bBEGIN\b)|(\bEND\b)/i;++t<l;){r=e.getLine(t);var c=s.exec(r);if(c&&(c[1]?a++:a--,!a))break}if(t>g.row)return new o(g.row,g.column,t,r.length)}}.call(g.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/sqlserver.js.map
