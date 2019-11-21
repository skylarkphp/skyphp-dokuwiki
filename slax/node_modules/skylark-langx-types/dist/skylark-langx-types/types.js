/**
 * skylark-langx-types - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(n){var t,r={}.toString,o=(t={},"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(n){t["[object "+n+"]"]=n.toLowerCase()}),function(n){return null==n?String(n):t[r.call(n)]||"object"});function i(n){var t;for(t in n)if(null!==n[t])return!1;return!0}function e(n){return"function"==o(n)}function u(n){return n&&n.nodeType}function c(n){return"number"==typeof n}function f(n){return"object"==o(n)}function l(n){return"string"==typeof n}function s(n){return n&&n==n.window}return n.attach("langx.types",{isArray:function(n){return n&&n.constructor===Array},isArrayLike:function(n){return!l(n)&&!u(n)&&"number"==typeof n.length&&!e(n)},isBoolean:function(n){return"boolean"==typeof n},isDefined:function(n){return void 0!==n},isDocument:function(n){return null!=n&&n.nodeType==n.DOCUMENT_NODE},isEmpty:i,isEmptyObject:i,isFunction:e,isHtmlNode:u,isNull:function(n){return"null"===o(n)},isNumber:c,isNumeric:c,isObject:f,isPlainObject:function(n){return f(n)&&!s(n)&&Object.getPrototypeOf(n)==Object.prototype},isString:l,isSameOrigin:function(n){if(n){var t=location.protocol+"//"+location.hostname;return location.port&&(t+=":"+location.port),n.startsWith(t)}},isSymbol:function(n){return"symbol"==typeof n||isObjectLike(n)&&objectToString.call(n)==symbolTag},isUndefined:function(n){return void 0===n},isWindow:s,type:o})});
//# sourceMappingURL=sourcemaps/types.js.map
