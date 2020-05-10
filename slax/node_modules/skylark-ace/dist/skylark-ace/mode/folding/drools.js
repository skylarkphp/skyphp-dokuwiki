/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),n=require("../../range").Range,t=require("./fold_mode").FoldMode,o=require("../../token_iterator").TokenIterator,r=exports.FoldMode=function(){};e.inherits(r,t),function(){this.foldingStartMarker=/\b(rule|declare|query|when|then)\b/,this.foldingStopMarker=/\bend\b/,this.getFoldWidgetRange=function(e,t,r){var i=e.getLine(r),a=i.match(this.foldingStartMarker);if(a){a.index;if(a[1]){var l={row:r,column:i.length},d=new o(e,l.row,l.column),u="end",f=d.getCurrentToken();for("when"==f.value&&(u="then");f;){if(f.value==u)return n.fromPoints(l,{row:d.getCurrentTokenRow(),column:d.getCurrentTokenColumn()});f=d.stepForward()}}}}}.call(r.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/drools.js.map
