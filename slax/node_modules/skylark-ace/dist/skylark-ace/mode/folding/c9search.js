/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";var n=t("../../lib/oop"),r=t("../../range").Range,i=t("./fold_mode").FoldMode,s=e.FoldMode=function(){};n.inherits(s,i),function(){this.foldingStartMarker=/^(\S.*:|Searching for.*)$/,this.foldingStopMarker=/^(\s+|Found.*)$/,this.getFoldWidgetRange=function(t,e,o){var n=t.doc.getAllLines(o),i=n[o],s=/^(Found.*|Searching for.*)$/,a=s.test(i)?s:/^(\S.*:|\s*)$/,d=o,f=o;if(this.foldingStartMarker.test(i)){for(var g=o+1,l=t.getLength();g<l&&!a.test(n[g]);g++);f=g}else if(this.foldingStopMarker.test(i)){for(g=o-1;g>=0&&(i=n[g],!a.test(i));g--);d=g}if(d!=f){var h=i.length;return a===s&&(h=i.search(/\(Found[^)]+\)$|$/)),new r(d,h,f,0)}}}.call(s.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/c9search.js.map
