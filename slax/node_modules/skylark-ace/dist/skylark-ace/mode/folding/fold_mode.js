/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,n,e){"use strict";var r=t("../../range").Range,i=n.FoldMode=function(){};(function(){this.foldingStartMarker=null,this.foldingStopMarker=null,this.getFoldWidget=function(t,n,e){var r=t.getLine(e);return this.foldingStartMarker.test(r)?"start":"markbeginend"==n&&this.foldingStopMarker&&this.foldingStopMarker.test(r)?"end":""},this.getFoldWidgetRange=function(t,n,e){return null},this.indentationBlock=function(t,n,e){var i=/\S/,o=t.getLine(n),l=o.search(i);if(-1!=l){for(var a=e||o.length,g=t.getLength(),f=n,c=n;++n<g;){var s=t.getLine(n).search(i);if(-1!=s){if(s<=l)break;c=n}}if(c>f){var u=t.getLine(c).length;return new r(f,a,c,u)}}},this.openingBracketBlock=function(t,n,e,i,o){var l={row:e,column:i+1},a=t.$findClosingBracket(n,l,o);if(a){var g=t.foldWidgets[a.row];return null==g&&(g=t.getFoldWidget(a.row)),"start"==g&&a.row>l.row&&(a.row--,a.column=t.getLine(a.row).length),r.fromPoints(l,a)}},this.closingBracketBlock=function(t,n,e,i,o){var l={row:e,column:i},a=t.$findOpeningBracket(n,l);if(a)return a.column++,l.column--,r.fromPoints(a,l)}}).call(i.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/fold_mode.js.map
