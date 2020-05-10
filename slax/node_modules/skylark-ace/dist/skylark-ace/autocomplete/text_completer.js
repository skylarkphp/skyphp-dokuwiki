/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var n=require("../range").Range,t=/[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;function e(e,a){var u=function(e,a){return e.getTextRange(n.fromPoints({row:0,column:0},a)).split(t).length-1}(e,a),o=e.getValue().split(t),r=Object.create(null),c=o[u];return o.forEach(function(n,t){if(n&&n!==c){var e=Math.abs(u-t),a=o.length-e;r[n]?r[n]=Math.max(a,r[n]):r[n]=a}}),r}exports.getCompletions=function(n,t,a,u,o){var r=e(t,a);o(null,Object.keys(r).map(function(n){return{caption:n,value:n,score:r[n],meta:"local"}}))}});
//# sourceMappingURL=../sourcemaps/autocomplete/text_completer.js.map
