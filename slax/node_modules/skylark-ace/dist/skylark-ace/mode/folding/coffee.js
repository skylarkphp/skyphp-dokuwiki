/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),t=require("./fold_mode").FoldMode,i=require("../../range").Range,r=exports.FoldMode=function(){};e.inherits(r,t),function(){this.getFoldWidgetRange=function(e,t,r){var n=this.indentationBlock(e,r);if(n)return n;var o=/\S/,a=e.getLine(r),d=a.search(o);if(-1!=d&&"#"==a[d]){for(var g=a.length,s=e.getLength(),f=r,l=r;++r<s;){var c=(a=e.getLine(r)).search(o);if(-1!=c){if("#"!=a[c])break;l=r}}if(l>f){var h=e.getLine(l).length;return new i(f,g,l,h)}}},this.getFoldWidget=function(e,t,i){var r=e.getLine(i),n=r.search(/\S/),o=e.getLine(i+1),a=e.getLine(i-1),d=a.search(/\S/),g=o.search(/\S/);if(-1==n)return e.foldWidgets[i-1]=-1!=d&&d<g?"start":"","";if(-1==d){if(n==g&&"#"==r[n]&&"#"==o[n])return e.foldWidgets[i-1]="",e.foldWidgets[i+1]="","start"}else if(d==n&&"#"==r[n]&&"#"==a[n]&&-1==e.getLine(i-2).search(/\S/))return e.foldWidgets[i-1]="start",e.foldWidgets[i+1]="","";return e.foldWidgets[i-1]=-1!=d&&d<n?"start":"",n<g?"start":""}}.call(r.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/coffee.js.map
