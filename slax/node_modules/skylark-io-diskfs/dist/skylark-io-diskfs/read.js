/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-async/Deferred","./diskfs"],function(r,e){return e.read=e.readFile=function(e,a){a=a||{};var n=new r,t=new FileReader;return t.onload=function(r){n.resolve(r.target.result)},t.onerror=function(r){var e=r.target.error.code;2===e?alert("please don't open this page using protocol fill:///"):alert("error code: "+e)},a.asArrayBuffer?t.readAsArrayBuffer(e):a.asDataUrl?t.readAsDataURL(e):a.asText?t.readAsText(e):t.readAsArrayBuffer(e),n.promise}});
//# sourceMappingURL=sourcemaps/read.js.map
