/**
 * skylark-domx-placeholders - The skylark placeholders library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-data"],function(t,a,e){const l="placeholder-style";function n(){return n}return a.mixin(n,{saveStyle:function(t){e.data(t,l,t.style.cssText)},restoreStyle:function(t){t.style.cssText=e.data(t,l)||"",e.removeData(t,l)}}),t.attach("domx.placeholders",n)});
//# sourceMappingURL=sourcemaps/placeholders.js.map
