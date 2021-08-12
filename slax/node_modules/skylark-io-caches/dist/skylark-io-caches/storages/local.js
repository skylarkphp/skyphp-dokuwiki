/**
 * skylark-io-caches - The skylarkjs web local storage classes library.
 * @author 
 * @version v0.9.0
 * @link 
 * @license MIT
 */
define(["skylark-langx-objects/mixin","skylark-langx-strings","../caches"],function(e,t,r){"use strict";var n=null;try{n=window.localStorage}catch(e){}function i(){return i}return e(i,{isSupported:function(){return!!n},set:function(e,r){return void 0===r?this.remove(e):(n.setItem(e,t.serializeValue(r)),r)},get:function(e,r){var i=t.deserializeValue(n.getItem(e));return void 0===i?r:i},remove:function(e){n.removeItem(e)},clear:function(){n.clear()},list:function(){for(var e={},t=0;t<n.length;t++)e[key]=n.key(t);return values}}),r.storages.local=i});
//# sourceMappingURL=../sourcemaps/storages/local.js.map
