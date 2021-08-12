/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects"],function(n,i){var r=n.isPlainObject;return function n(i,e,t,o){for(var a in e)o&&void 0!==i[a]||(t&&r(e[a])?(r(i[a])||(i[a]={}),n(i[a],e[a],t,o)):void 0!==e[a]&&(i[a]=e[a]));return i}});
//# sourceMappingURL=sourcemaps/_mixin.js.map
