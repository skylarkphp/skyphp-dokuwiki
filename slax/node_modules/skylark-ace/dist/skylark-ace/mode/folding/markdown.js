/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),t=require("./fold_mode").FoldMode,n=require("../../range").Range,r=exports.FoldMode=function(){};e.inherits(r,t),function(){this.foldingStartMarker=/^(?:[=-]+\s*$|#{1,6} |`{3})/,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);return this.foldingStartMarker.test(r)?"`"==r[0]&&"start"==e.bgTokenizer.getState(n)?"end":"start":""},this.getFoldWidgetRange=function(e,t,r){var i=e.getLine(r),a=i.length,g=e.getLength(),o=r,f=r;if(i.match(this.foldingStartMarker)){if("`"==i[0]){if("start"!==e.bgTokenizer.getState(r)){for(;++r<g&&!("`"==(i=e.getLine(r))[0]&"```"==i.substring(0,3)););return new n(o,a,r,0)}for(;r-- >0&&!("`"==(i=e.getLine(r))[0]&"```"==i.substring(0,3)););return new n(r,i.length,o,0)}var s,u="markup.heading";if(h(r)){for(var d=c();++r<g;){if(h(r))if(c()>=d)break}if((f=r-(s&&-1!=["=","-"].indexOf(s.value[0])?2:1))>o)for(;f>o&&/^\s*$/.test(e.getLine(f));)f--;if(f>o){var l=e.getLine(f).length;return new n(o,a,f,l)}}}function h(t){return(s=e.getTokens(t)[0])&&0===s.type.lastIndexOf(u,0)}function c(){var e=s.value[0];return"="==e?6:"-"==e?5:7-s.value.search(/[^#]|$/)}}}.call(r.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/markdown.js.map
