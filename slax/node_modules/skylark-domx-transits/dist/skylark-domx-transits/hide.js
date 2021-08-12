/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./transit"],function(n,i,t,a){return t.hide=function(t,r,e){return r?(!e&&n.isFunction(r)&&(e=r,r="normal"),a(t,{opacity:0,scale:"0,0"},r,function(){i.hide(t),e&&e.call(t)})):i.hide(t),this}});
//# sourceMappingURL=sourcemaps/hide.js.map
