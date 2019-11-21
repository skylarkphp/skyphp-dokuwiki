/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","./version"],function(t){"1.7"===t.fn.jquery.substring(0,3)&&(t.each(["Width","Height"],function(e,i){var n="Width"===i?["Left","Right"]:["Top","Bottom"],r=i.toLowerCase(),s={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};function u(e,i,r,s){return t.each(n,function(){i-=parseFloat(t.css(e,"padding"+this))||0,r&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),s&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}t.fn["inner"+i]=function(e){return void 0===e?s["inner"+i].call(this):this.each(function(){t(this).css(r,u(this,e)+"px")})},t.fn["outer"+i]=function(e,n){return"number"!=typeof e?s["outer"+i].call(this,e):this.each(function(){t(this).css(r,u(this,e,!0,n)+"px")})}}),t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.expr.pseudos||(t.expr.pseudos=t.expr[":"]),t.uniqueSort||(t.uniqueSort=t.unique)});
//# sourceMappingURL=sourcemaps/jquery-1-7.js.map
