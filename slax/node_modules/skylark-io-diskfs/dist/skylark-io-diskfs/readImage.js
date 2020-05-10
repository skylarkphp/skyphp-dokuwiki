/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/Deferred","./diskfs","./read"],function(e,n,r){return n.readImage=function(n){var t=new e,a=new Image;return a.onload=function(){t.resolve(a)},a.onerror=function(e){t.reject(e)},r(n,{asDataUrl:!0}).then(function(e){a.src=e}).catch(function(e){t.reject(e)}),t.promise}});
//# sourceMappingURL=sourcemaps/readImage.js.map
