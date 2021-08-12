/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/types","./diskfs"],function(e,n){return n.downlad=function(n,t){if(window.navigator.msSaveBlob)e.isString(n)&&(n=dataURItoBlob(n)),window.navigator.msSaveBlob(n,t);else{var a=document.createElement("a");n instanceof Blob&&(n=URL.createObjectURL(n)),a.href=n,a.setAttribute("download",t||"noname"),a.click()}}});
//# sourceMappingURL=sourcemaps/download.js.map
