/**
 * skylark-io-caches - The skylarkjs web local storage classes library.
 * @author 
 * @version v0.9.0
 * @link 
 * @license MIT
 */
define(["skylark-langx-objects/mixin","skylark-langx-strings","../caches"],function(e,t,n){"use strict";var r=null;try{r=window.sessiionStorage}catch(e){}return e(function e(){return e},{isSupported:function(){return!!r},set:function(e,n){return void 0===n?this.remove(e):(r.setItem(e,t.serializeValue(n)),n)},get:function(e,n){var i=t.deserializeValue(r.getItem(e));return void 0===i?n:i},remove:function(e){r.removeItem(e)},clear:function(){r.clear()},list:function(){for(var e={},t=0;t<r.length;t++)e[key]=r.key(t);return values}}),n.storages.session=sessionStorage});
//# sourceMappingURL=../sourcemaps/storages/session.js.map
