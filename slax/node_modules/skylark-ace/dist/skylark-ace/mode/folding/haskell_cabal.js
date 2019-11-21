/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("../../lib/oop"),g=e("./fold_mode").FoldMode,r=e("../../range").Range,s=t.FoldMode=function(){};n.inherits(s,g),function(){this.isHeading=function(e,t){var i=e.getTokens(t)[0];return 0==t||i&&0===i.type.lastIndexOf("markup.heading",0)},this.getFoldWidget=function(e,t,i){if(this.isHeading(e,i))return"start";if("markbeginend"===t&&!/^\s*$/.test(e.getLine(i))){for(var n=e.getLength();++i<n&&/^\s*$/.test(e.getLine(i)););if(i==n||this.isHeading(e,i))return"end"}return""},this.getFoldWidgetRange=function(e,t,i){var n=e.getLine(i).length,g=e.getLength(),s=i,d=i;if(this.isHeading(e,i)){for(;++i<g;)if(this.isHeading(e,i)){i--;break}if((d=i)>s)for(;d>s&&/^\s*$/.test(e.getLine(d));)d--;if(d>s){var o=e.getLine(d).length;return new r(s,n,d,o)}}else if("end"===this.getFoldWidget(e,t,i)){for(d=i,o=e.getLine(d).length;--i>=0&&!this.isHeading(e,i););n=e.getLine(i).length;return new r(i,n,d,o)}}}.call(s.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/haskell_cabal.js.map
