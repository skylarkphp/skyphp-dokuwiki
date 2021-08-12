/**
 * skylark-domx-images - The skylark image library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./images","./watch"],function(n,r,a){return r.preload=function(r,e){n.isString(r)&&(r=[r]);var i=[];return r.forEach(function(n){var r=new Image;r.src=n,i.push(r)}),a(i)}});
//# sourceMappingURL=sourcemaps/preload.js.map
