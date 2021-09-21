/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-async/deferred","./diskfs","./read"],function(e,n,r){return n.readImage=function(n){var a=new e,t=new Image;return t.onload=function(){a.resolve(t)},t.onerror=function(e){a.reject(e)},r(n,{asDataUrl:!0}).then(function(e){t.src=e}).catch(function(e){a.reject(e)}),a.promise}});
//# sourceMappingURL=sourcemaps/read-image.js.map
