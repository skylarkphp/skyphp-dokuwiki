/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var r=e("../../lib/oop"),n=e("./fold_mode").FoldMode,o=e("../../range").Range,a=t.FoldMode=function(){};r.inherits(a,n),function(){this.getFoldWidgetRange=function(e,t,i){var r=this.indentationBlock(e,i);if(r)return r;var n=/\S/,a=e.getLine(i),d=a.search(n);if(-1!=d&&"##"==a[d]){for(var g=a.length,s=e.getLength(),f=i,l=i;++i<s;){var c=(a=e.getLine(i)).search(n);if(-1!=c){if("##"!=a[c])break;l=i}}if(l>f){var h=e.getLine(l).length;return new o(f,g,l,h)}}},this.getFoldWidget=function(e,t,i){var r=e.getLine(i),n=r.search(/\S/),o=e.getLine(i+1),a=e.getLine(i-1),d=a.search(/\S/),g=o.search(/\S/);if(-1==n)return e.foldWidgets[i-1]=-1!=d&&d<g?"start":"","";if(-1==d){if(n==g&&"##"==r[n]&&"##"==o[n])return e.foldWidgets[i-1]="",e.foldWidgets[i+1]="","start"}else if(d==n&&"##"==r[n]&&"##"==a[n]&&-1==e.getLine(i-2).search(/\S/))return e.foldWidgets[i-1]="start",e.foldWidgets[i+1]="","";return e.foldWidgets[i-1]=-1!=d&&d<n?"start":"",n<g?"start":""}}.call(a.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/velocity.js.map
