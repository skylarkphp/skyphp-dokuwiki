/**
 * skylark-langx-funcs - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./funcs","./defer"],function(n,e){return n.debounce=function(n,c,u){var t,i,o=function(){var o=this,f=arguments;return r(),t=setTimeout(function(){t=null,u?i=e(n,f,o):n.apply(o,f)},c),{cancel:r}},r=o.cancel=function(){t&&clearTimeout(t),i&&i.cancel(),t=void 0,i=void 0};return o}});
//# sourceMappingURL=sourcemaps/debounce.js.map
