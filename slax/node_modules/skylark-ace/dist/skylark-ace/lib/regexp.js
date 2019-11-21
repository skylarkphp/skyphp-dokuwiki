/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var i,n={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},l=void 0===n.exec.call(/()??/,"")[1],p=(i=/^/g,n.test.call(i,""),!i.lastIndex);p&&l||(RegExp.prototype.exec=function(e){var t,r,i,o=n.exec.apply(this,arguments);if("string"==typeof e&&o){if(!l&&o.length>1&&function(e,t,r){if(Array.prototype.indexOf)return e.indexOf(t,r);for(var i=r||0;i<e.length;i++)if(e[i]===t)return i;return-1}(o,"")>-1&&(r=RegExp(this.source,n.replace.call(((i=this).global?"g":"")+(i.ignoreCase?"i":"")+(i.multiline?"m":"")+(i.extended?"x":"")+(i.sticky?"y":""),"g","")),n.replace.call(e.slice(o.index),r,function(){for(var e=1;e<arguments.length-2;e++)void 0===arguments[e]&&(o[e]=void 0)})),this._xregexp&&this._xregexp.captureNames)for(var s=1;s<o.length;s++)(t=this._xregexp.captureNames[s-1])&&(o[t]=o[s]);!p&&this.global&&!o[0].length&&this.lastIndex>o.index&&this.lastIndex--}return o},p||(RegExp.prototype.test=function(e){var t=n.exec.call(this,e);return t&&this.global&&!t[0].length&&this.lastIndex>t.index&&this.lastIndex--,!!t}))});
//# sourceMappingURL=../sourcemaps/lib/regexp.js.map
