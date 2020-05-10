/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),t=require("./fold_mode").FoldMode,i=require("../../range").Range,n=exports.FoldMode=function(){};e.inherits(n,t),function(){this.isHeading=function(e,t){var i=e.getTokens(t)[0];return 0==t||i&&0===i.type.lastIndexOf("markup.heading",0)},this.getFoldWidget=function(e,t,i){if(this.isHeading(e,i))return"start";if("markbeginend"===t&&!/^\s*$/.test(e.getLine(i))){for(var n=e.getLength();++i<n&&/^\s*$/.test(e.getLine(i)););if(i==n||this.isHeading(e,i))return"end"}return""},this.getFoldWidgetRange=function(e,t,n){var g=e.getLine(n).length,r=e.getLength(),s=n,d=n;if(this.isHeading(e,n)){for(;++n<r;)if(this.isHeading(e,n)){n--;break}if((d=n)>s)for(;d>s&&/^\s*$/.test(e.getLine(d));)d--;if(d>s){var o=e.getLine(d).length;return new i(s,g,d,o)}}else if("end"===this.getFoldWidget(e,t,n)){for(d=n,o=e.getLine(d).length;--n>=0&&!this.isHeading(e,n););g=e.getLine(n).length;return new i(n,g,d,o)}}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/haskell_cabal.js.map
