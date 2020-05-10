/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=require("./cstyle").FoldMode,i=require("../../range").Range,g=exports.FoldMode=function(){};t.inherits(g,e),function(){this.importRegex=/^import /,this.getCStyleFoldWidget=this.getFoldWidget,this.getFoldWidget=function(t,e,i){if("markbegin"===e){var g=t.getLine(i);if(this.importRegex.test(g)&&(0==i||!this.importRegex.test(t.getLine(i-1))))return"start"}return this.getCStyleFoldWidget(t,e,i)},this.getCstyleFoldWidgetRange=this.getFoldWidgetRange,this.getFoldWidgetRange=function(t,e,g,n){var r=(h=t.getLine(g)).match(this.importRegex);if(!r||"markbegin"!==e)return this.getCstyleFoldWidgetRange(t,e,g,n);for(var o=r[0].length,s=t.getLength(),d=g,a=g;++g<s;){var h;if(!(h=t.getLine(g)).match(/^\s*$/)){if(!h.match(this.importRegex))break;a=g}}if(a>d){var l=t.getLine(a).length;return new i(d,o,a,l)}}}.call(g.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/java.js.map
