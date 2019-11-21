/**
 * skylark-storages-cache - The skylarkjs web local storage classes library.
 * @author 
 * @version v0.9.0
 * @link 
 * @license MIT
 */
define(["skylark-langx/langx","./cache"],function(e,n){var t=null;try{t=window.localStorage}catch(e){}function r(){return r}return e.mixin(r,{isSupported:function(){return!!t},set:function(n,r){return void 0===r?this.remove(n):(t.setItem(n,e.serializeValue(r)),r)},get:function(n,r){var i=e.deserializeValue(t.getItem(n));return void 0===i?r:i},remove:function(e){t.removeItem(e)},clear:function(){t.clear()},list:function(){for(var e={},n=0;n<t.length;n++)e[key]=t.key(n);return values}}),n.localStorage=r});
//# sourceMappingURL=sourcemaps/localStorage.js.map
