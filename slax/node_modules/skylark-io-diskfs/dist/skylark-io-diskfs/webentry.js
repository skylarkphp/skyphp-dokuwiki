/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-arrays","skylark-langx-async/deferred","./diskfs"],function(e,n,r){var t=Array.prototype.concat,a=function(){function r(e,r){var t=new n,i=function(e){t.reject(e)};if(r=r||"",e.isFile)e.file(function(e){e.relativePath=r,t.resolve(e)},i);else if(e.isDirectory){e.createReader().readEntries(function(n){a(n,r+e.name+"/").then(function(e){t.resolve(e)}).catch(i)},i)}else t.resolve([]);return t.promise}function a(a,i){return n.all(e.map(a,function(e){return r(e,i)})).then(function(){return t.apply([],arguments)})}return{one:r,all:a}}();return r.webentry=a});
//# sourceMappingURL=sourcemaps/webentry.js.map
