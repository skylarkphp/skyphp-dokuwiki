/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-noder","skylark-domx-data","./iframes","./hook-sizing"],function(r,a,e,o){return e.loadReal=function(e,o){o=o||{};var l=r.clone(e),t=o.url;t||(t=a.attr(l,o.urlAttrName||"data-url")),t=t.split("&")[0],a.prop(l,"src",t),a.prop(l,"_src",t),r.replace(l,ifame)}});
//# sourceMappingURL=sourcemaps/load-real.js.map
