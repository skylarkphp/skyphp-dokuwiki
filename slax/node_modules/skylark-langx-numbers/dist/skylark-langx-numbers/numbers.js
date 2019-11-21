/**
 * skylark-langx-numbers - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-langx-types"],function(t,e){var n=e.isObject,r=e.isSymbol,i=1/0,a=1.7976931348623157e308,u=NaN,f=/^\s+|\s+$/g,s=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,l=/^0o[0-7]+$/i,c=parseInt;function y(t){return t?(t=b(t))===i||t===-i?(t<0?-1:1)*a:t==t?t:0:0===t?t:0}function b(t){if("number"==typeof t)return t;if(r(t))return u;if(n(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=n(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(f,"");var i=o.test(t);return i||l.test(t)?c(t.slice(2),i?2:8):s.test(t)?u:+t}return t.attach("langx.numbers",{toFinite:y,toNumber:b,toInteger:function(t){var e=y(t),n=e%1;return e==e?n?e-n:e:0}})});
//# sourceMappingURL=sourcemaps/numbers.js.map
