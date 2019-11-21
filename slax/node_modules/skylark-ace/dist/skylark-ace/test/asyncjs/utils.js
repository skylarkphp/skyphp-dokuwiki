/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,t,i){n("asyncjs/async").plugin({delay:function(n){return this.each(function(t,i){setTimeout(function(){i()},n)})},timeout:function(n){n=n||0;var t=this.source;return this.next=function(i){var o,e=setTimeout(function(){o=!0,i("Source did not respond after "+n+"ms!")},n);t.next(function(n,t){o||(o=!0,clearTimeout(e),i(n,t))})},new this.constructor(this)},get:function(n){return this.map(function(t,i){i(null,t[n])})},inspect:function(){return this.each(function(n,t){console.log(JSON.stringify(n)),t()})},print:function(){return this.each(function(n,t){console.log(n),t()})}})});
//# sourceMappingURL=../../sourcemaps/test/asyncjs/utils.js.map
