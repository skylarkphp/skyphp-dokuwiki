/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,n,t){"use strict";var o=e("../../lib/oop"),r=e("../../range").Range,i=e("./fold_mode").FoldMode,a=e("../../token_iterator").TokenIterator,l=n.FoldMode=function(){};o.inherits(l,i),function(){this.foldingStartMarker=/\b(rule|declare|query|when|then)\b/,this.foldingStopMarker=/\bend\b/,this.getFoldWidgetRange=function(e,n,t){var o=e.getLine(t),i=o.match(this.foldingStartMarker);if(i){i.index;if(i[1]){var l={row:t,column:o.length},d=new a(e,l.row,l.column),u="end",f=d.getCurrentToken();for("when"==f.value&&(u="then");f;){if(f.value==u)return r.fromPoints(l,{row:d.getCurrentTokenRow(),column:d.getCurrentTokenColumn()});f=d.stepForward()}}}}}.call(l.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/drools.js.map
