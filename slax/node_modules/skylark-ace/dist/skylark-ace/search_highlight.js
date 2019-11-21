/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("./lib/lang"),h=(t("./lib/oop"),t("./range").Range),s=function(t,e,i){this.setRegexp(t),this.clazz=e,this.type=i||"text"};(function(){this.MAX_RANGES=500,this.setRegexp=function(t){this.regExp+""!=t+""&&(this.regExp=t,this.cache=[])},this.update=function(t,e,i,s){if(this.regExp)for(var a=s.firstRow,r=s.lastRow,c=a;c<=r;c++){var g=this.cache[c];null==g&&((g=n.getMatchOffsets(i.getLine(c),this.regExp)).length>this.MAX_RANGES&&(g=g.slice(0,this.MAX_RANGES)),g=g.map(function(t){return new h(c,t.offset,c,t.offset+t.length)}),this.cache[c]=g.length?g:"");for(var f=g.length;f--;)e.drawSingleLineMarker(t,g[f].toScreenRange(i),this.clazz,s)}}}).call(s.prototype),e.SearchHighlight=s});
//# sourceMappingURL=sourcemaps/search_highlight.js.map
