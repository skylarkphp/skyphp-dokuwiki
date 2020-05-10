/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=require("../../range").Range,n=require("./fold_mode").FoldMode,i=exports.FoldMode=function(){};t.inherits(i,n),function(){this.foldingStartMarker=/^\s*\[([^\])]*)]\s*(?:$|[;#])/,this.getFoldWidgetRange=function(t,n,i){var o=this.foldingStartMarker,r=t.getLine(i),a=r.match(o);if(a){for(var f=a[1]+".",g=r.length,d=t.getLength(),l=i,s=i;++i<d;)if(r=t.getLine(i),!/^\s*$/.test(r)){if((a=r.match(o))&&0!==a[1].lastIndexOf(f,0))break;s=i}if(s>l){var h=t.getLine(s).length;return new e(l,g,s,h)}}}}.call(i.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/ini.js.map
