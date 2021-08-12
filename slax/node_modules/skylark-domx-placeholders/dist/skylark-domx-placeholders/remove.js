/**
 * skylark-domx-placeholders - The skylark placeholders library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-noder","skylark-domx-data","./placeholders"],function(e,a,r){return r.remove=function(r){var o=a.data(r,"placeholder");o&&(e.remove(o),a.removeData(r,"placeholder"))}});
//# sourceMappingURL=sourcemaps/remove.js.map
