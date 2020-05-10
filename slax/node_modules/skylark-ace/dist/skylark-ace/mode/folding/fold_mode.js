/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../range").Range,n=exports.FoldMode=function(){};(function(){this.foldingStartMarker=null,this.foldingStopMarker=null,this.getFoldWidget=function(t,n,e){var r=t.getLine(e);return this.foldingStartMarker.test(r)?"start":"markbeginend"==n&&this.foldingStopMarker&&this.foldingStopMarker.test(r)?"end":""},this.getFoldWidgetRange=function(t,n,e){return null},this.indentationBlock=function(n,e,r){var i=/\S/,o=n.getLine(e),l=o.search(i);if(-1!=l){for(var a=r||o.length,g=n.getLength(),f=e,c=e;++e<g;){var s=n.getLine(e).search(i);if(-1!=s){if(s<=l)break;c=e}}if(c>f){var u=n.getLine(c).length;return new t(f,a,c,u)}}},this.openingBracketBlock=function(n,e,r,i,o){var l={row:r,column:i+1},a=n.$findClosingBracket(e,l,o);if(a){var g=n.foldWidgets[a.row];return null==g&&(g=n.getFoldWidget(a.row)),"start"==g&&a.row>l.row&&(a.row--,a.column=n.getLine(a.row).length),t.fromPoints(l,a)}},this.closingBracketBlock=function(n,e,r,i,o){var l={row:r,column:i},a=n.$findOpeningBracket(e,l);if(a)return a.column++,l.column--,t.fromPoints(a,l)}}).call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/fold_mode.js.map
