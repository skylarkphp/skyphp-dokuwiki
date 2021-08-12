/**
 * skylark-devices-keyboard - The keyboard  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./keyboard","./aliases","./codes","./names"],function(e,r,n,i,t){return r.isEventKey=function(r,t){var s=r.which||r.keyCode||r.charCode;if(null===s||void 0===s)return!1;if(e.isString(t)){var a;if(a=i[t.toLowerCase()])return a===s;if(a=n[t.toLowerCase()])return a===s}else if(e.isNumber(t))return t===s;return!1}});
//# sourceMappingURL=sourcemaps/isEventKey.js.map
