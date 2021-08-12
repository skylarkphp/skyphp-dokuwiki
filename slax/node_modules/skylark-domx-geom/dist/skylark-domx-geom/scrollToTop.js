/**
 * skylark-domx-geom - The skylark geom library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./geom"],function(e,n,r){return r.scrollToTop=function(n,r,l,o){var t=parseInt(n.scrollTop),a=0,s=1e3*l/5,c=parseInt(r),u=setInterval(function(){++a<=s&&(n.scrollTop=(c-t)/s*a+t),a>=s+1&&(clearInterval(u),o&&e.debounce(o,1e3)())},5);return this}});
//# sourceMappingURL=sourcemaps/scrollToTop.js.map
