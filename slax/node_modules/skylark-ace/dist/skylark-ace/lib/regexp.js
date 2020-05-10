/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e,t={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},r=void 0===t.exec.call(/()??/,"")[1],i=(e=/^/g,t.test.call(e,""),!e.lastIndex);i&&r||(RegExp.prototype.exec=function(e){var n,l,p,o=t.exec.apply(this,arguments);if("string"==typeof e&&o){if(!r&&o.length>1&&function(e,t,r){if(Array.prototype.indexOf)return e.indexOf(t,r);for(var i=r||0;i<e.length;i++)if(e[i]===t)return i;return-1}(o,"")>-1&&(l=RegExp(this.source,t.replace.call(((p=this).global?"g":"")+(p.ignoreCase?"i":"")+(p.multiline?"m":"")+(p.extended?"x":"")+(p.sticky?"y":""),"g","")),t.replace.call(e.slice(o.index),l,function(){for(var e=1;e<arguments.length-2;e++)void 0===arguments[e]&&(o[e]=void 0)})),this._xregexp&&this._xregexp.captureNames)for(var s=1;s<o.length;s++)(n=this._xregexp.captureNames[s-1])&&(o[n]=o[s]);!i&&this.global&&!o[0].length&&this.lastIndex>o.index&&this.lastIndex--}return o},i||(RegExp.prototype.test=function(e){var r=t.exec.call(this,e);return r&&this.global&&!r[0].length&&this.lastIndex>r.index&&this.lastIndex--,!!r}))});
//# sourceMappingURL=../sourcemaps/lib/regexp.js.map
