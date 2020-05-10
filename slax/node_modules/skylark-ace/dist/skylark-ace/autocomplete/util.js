/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";exports.parForEach=function(e,i,r){var n=0,t=e.length;0===t&&r();for(var o=0;o<t;o++)i(e[o],function(e,i){++n===t&&r(e,i)})};var e=/[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;exports.retrievePrecedingIdentifier=function(i,r,n){n=n||e;for(var t=[],o=r-1;o>=0&&n.test(i[o]);o--)t.push(i[o]);return t.reverse().join("")},exports.retrieveFollowingIdentifier=function(i,r,n){n=n||e;for(var t=[],o=r;o<i.length&&n.test(i[o]);o++)t.push(i[o]);return t},exports.getCompletionPrefix=function(e){var i,r=e.getCursorPosition(),n=e.session.getLine(r.row);return e.completers.forEach(function(e){e.identifierRegexps&&e.identifierRegexps.forEach(function(e){!i&&e&&(i=this.retrievePrecedingIdentifier(n,r.column,e))}.bind(this))}.bind(this)),i||this.retrievePrecedingIdentifier(n,r.column)}});
//# sourceMappingURL=../sourcemaps/autocomplete/util.js.map
