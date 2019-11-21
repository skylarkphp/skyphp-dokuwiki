/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../../lib/oop"),o=t("../../range").Range,r=t("./fold_mode").FoldMode,a=e.FoldMode=function(){};i.inherits(a,r),function(){this.foldingStartMarker=/^\s*\[([^\])]*)]\s*(?:$|[;#])/,this.getFoldWidgetRange=function(t,e,n){var i=this.foldingStartMarker,r=t.getLine(n),a=r.match(i);if(a){for(var f=a[1]+".",g=r.length,d=t.getLength(),l=n,s=n;++n<d;)if(r=t.getLine(n),!/^\s*$/.test(r)){if((a=r.match(i))&&0!==a[1].lastIndexOf(f,0))break;s=n}if(s>l){var h=t.getLine(s).length;return new o(l,g,s,h)}}}}.call(a.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/ini.js.map
