/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,t,e){var a=n("../range").Range,u=/[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;function o(n,t){var e=function(n,t){return n.getTextRange(a.fromPoints({row:0,column:0},t)).split(u).length-1}(n,t),o=n.getValue().split(u),r=Object.create(null),c=o[e];return o.forEach(function(n,t){if(n&&n!==c){var a=Math.abs(e-t),u=o.length-a;r[n]?r[n]=Math.max(u,r[n]):r[n]=u}}),r}t.getCompletions=function(n,t,e,a,u){var r=o(t,e);u(null,Object.keys(r).map(function(n){return{caption:n,value:n,score:r[n],meta:"local"}}))}});
//# sourceMappingURL=../sourcemaps/autocomplete/text_completer.js.map
