/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var g=t("../../lib/oop"),n=t("./cstyle").FoldMode,r=t("../../range").Range,o=e.FoldMode=function(){};g.inherits(o,n),function(){this.importRegex=/^import /,this.getCStyleFoldWidget=this.getFoldWidget,this.getFoldWidget=function(t,e,i){if("markbegin"===e){var g=t.getLine(i);if(this.importRegex.test(g)&&(0==i||!this.importRegex.test(t.getLine(i-1))))return"start"}return this.getCStyleFoldWidget(t,e,i)},this.getCstyleFoldWidgetRange=this.getFoldWidgetRange,this.getFoldWidgetRange=function(t,e,i,g){var n=(h=t.getLine(i)).match(this.importRegex);if(!n||"markbegin"!==e)return this.getCstyleFoldWidgetRange(t,e,i,g);for(var o=n[0].length,s=t.getLength(),d=i,a=i;++i<s;){var h;if(!(h=t.getLine(i)).match(/^\s*$/)){if(!h.match(this.importRegex))break;a=i}}if(a>d){var l=t.getLine(a).length;return new r(d,o,a,l)}}}.call(o.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/java.js.map
