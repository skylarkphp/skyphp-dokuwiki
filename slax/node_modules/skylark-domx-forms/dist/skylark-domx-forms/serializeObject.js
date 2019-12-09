/**
 * skylark-domx-forms - The skylark html form library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./forms","./serializeArray"],function(r,a,n){return a.serializeObject=function(a){var e={};return r.each(n(a),function(a,n){var i=n.name,c=n.value;e[i]=void 0===e[i]?c:r.isArray(e[i])?e[i].concat(c):[e[i],c]}),e}});
//# sourceMappingURL=sourcemaps/serializeObject.js.map
