/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects"],function(e,r){var t=Array.prototype.slice,n=e.isBoolean;return function(e){var r=t.call(arguments,0),o=r.shift(),a=!1;return n(r[r.length-1])&&(a=r.pop()),{target:o,sources:r,deep:a}}});
//# sourceMappingURL=sourcemaps/_parse_mixin_args.js.map
