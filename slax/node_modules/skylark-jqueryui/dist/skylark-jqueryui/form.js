/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","./version"],function(r){return r.fn._form=function(){return"string"==typeof this[0].form?this.closest("form"):r(this[0].form)}});
//# sourceMappingURL=sourcemaps/form.js.map
