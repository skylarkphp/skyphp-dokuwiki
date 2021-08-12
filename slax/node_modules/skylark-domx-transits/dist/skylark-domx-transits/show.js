/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./transit"],function(n,s,t,a){return t.show=function(t,i,r){return s.show(t),i&&(!r&&n.isFunction(i)&&(r=i,i="normal"),s.css(t,"opacity",0),a(t,{opacity:1,scale:"1,1"},i,r)),this}});
//# sourceMappingURL=sourcemaps/show.js.map
