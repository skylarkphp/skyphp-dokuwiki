/**
 * skylark-domx-forms - The skylark html form library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./forms"],function(n,e){return e.serialize=function(n){var e=[];return serializeArray(n).forEach(function(n){e.push(encodeURIComponent(n.name)+"="+encodeURIComponent(n.value))}),e.join("&")}});
//# sourceMappingURL=sourcemaps/serialize.js.map
