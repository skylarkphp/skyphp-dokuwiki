/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects","./mixin"],function(n,t){var e=Array.prototype.slice;return n.extend=function(n){var o,r=e.call(arguments,1);return"boolean"==typeof n&&(o=n,n=r.shift()),0==r.length&&(r=[n],n=this),r.forEach(function(e){t(n,e,o)}),n}});
//# sourceMappingURL=sourcemaps/extend.js.map
