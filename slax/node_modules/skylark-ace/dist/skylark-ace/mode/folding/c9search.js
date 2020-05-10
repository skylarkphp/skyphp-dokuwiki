/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=require("../../range").Range,o=require("./fold_mode").FoldMode,n=exports.FoldMode=function(){};t.inherits(n,o),function(){this.foldingStartMarker=/^(\S.*:|Searching for.*)$/,this.foldingStopMarker=/^(\s+|Found.*)$/,this.getFoldWidgetRange=function(t,o,n){var r=t.doc.getAllLines(n),i=r[n],s=/^(Found.*|Searching for.*)$/,a=s.test(i)?s:/^(\S.*:|\s*)$/,d=n,f=n;if(this.foldingStartMarker.test(i)){for(var g=n+1,l=t.getLength();g<l&&!a.test(r[g]);g++);f=g}else if(this.foldingStopMarker.test(i)){for(g=n-1;g>=0&&(i=r[g],!a.test(i));g--);d=g}if(d!=f){var h=i.length;return a===s&&(h=i.search(/\(Found[^)]+\)$|$/)),new e(d,h,f,0)}}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/c9search.js.map
