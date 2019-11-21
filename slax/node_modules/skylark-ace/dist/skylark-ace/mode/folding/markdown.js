/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("./fold_mode").FoldMode,a=e("../../range").Range,g=t.FoldMode=function(){};r.inherits(g,i),function(){this.foldingStartMarker=/^(?:[=-]+\s*$|#{1,6} |`{3})/,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);return this.foldingStartMarker.test(r)?"`"==r[0]&&"start"==e.bgTokenizer.getState(n)?"end":"start":""},this.getFoldWidgetRange=function(e,t,n){var r=e.getLine(n),i=r.length,g=e.getLength(),o=n,f=n;if(r.match(this.foldingStartMarker)){if("`"==r[0]){if("start"!==e.bgTokenizer.getState(n)){for(;++n<g&&!("`"==(r=e.getLine(n))[0]&"```"==r.substring(0,3)););return new a(o,i,n,0)}for(;n-- >0&&!("`"==(r=e.getLine(n))[0]&"```"==r.substring(0,3)););return new a(n,r.length,o,0)}var s,u="markup.heading";if(h(n)){for(var d=c();++n<g;){if(h(n))if(c()>=d)break}if((f=n-(s&&-1!=["=","-"].indexOf(s.value[0])?2:1))>o)for(;f>o&&/^\s*$/.test(e.getLine(f));)f--;if(f>o){var l=e.getLine(f).length;return new a(o,i,f,l)}}}function h(t){return(s=e.getTokens(t)[0])&&0===s.type.lastIndexOf(u,0)}function c(){var e=s.value[0];return"="==e?6:"-"==e?5:7-s.value.search(/[^#]|$/)}}}.call(g.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/markdown.js.map
