/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("./lib/lang"),e=(require("./lib/oop"),require("./range").Range),i=function(t,e,i){this.setRegexp(t),this.clazz=e,this.type=i||"text"};(function(){this.MAX_RANGES=500,this.setRegexp=function(t){this.regExp+""!=t+""&&(this.regExp=t,this.cache=[])},this.update=function(i,n,h,s){if(this.regExp)for(var a=s.firstRow,r=s.lastRow,c=a;c<=r;c++){var g=this.cache[c];null==g&&((g=t.getMatchOffsets(h.getLine(c),this.regExp)).length>this.MAX_RANGES&&(g=g.slice(0,this.MAX_RANGES)),g=g.map(function(t){return new e(c,t.offset,c,t.offset+t.length)}),this.cache[c]=g.length?g:"");for(var f=g.length;f--;)n.drawSingleLineMarker(i,g[f].toScreenRange(h),this.clazz,s)}}}).call(i.prototype),exports.SearchHighlight=i});
//# sourceMappingURL=sourcemaps/search_highlight.js.map
