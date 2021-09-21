/**
 * skylark-domx-forms - The skylark html form library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./forms","./serialize-array"],function(a,r,n){return r.serializeObject=function(r){var e={};return a.each(n(r),function(r,n){var i=n.name,c=n.value;e[i]=void 0===e[i]?c:a.isArray(e[i])?e[i].concat(c):[e[i],c]}),e}});
//# sourceMappingURL=sourcemaps/serialize-object.js.map
