/**
 * skylark-domx-browser - The skylark browser library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../browser"],function(t,e){"use strict";var n,r,o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},i=null,s="",a="",c={},l={},u=/^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,p=window.document.createElement("div"),d=p.webkitMatchesSelector||p.mozMatchesSelector||p.oMatchesSelector||p.matchesSelector,m=p.style;for(var v in m){var w=v.match(r||u);if(w){r||(n=w[1],r=new RegExp("^("+n+")(.*)$"),n,s="-"+n.toLowerCase()+"-",a=n.toLowerCase()),c[t.lowerFirst(w[2])]=v;var f=t.dasherize(w[2]);l[f]=s+f,o[v]&&(i=o[v])}}i||void 0!==m.transition&&(i=o.transition);var z={normalizeStyleProperty:function(t){return c[t]||t},normalizeCssProperty:function(t){return l[t]||t},normalizeCssEvent:function(t){return a?a+t:t.toLowerCase()},matchesSelector:d};return t.mixin(e,z),e.css3PropPrefix=z.propPrefix=s,i&&(e.support.transition=z.transition={end:i}),e.support.cssPointerEvents=z.pointerEvents=(p.style.cssText="pointer-events:auto","auto"===p.style.pointerEvents),p=null,e.support.css3=z});
//# sourceMappingURL=../sourcemaps/support/css3.js.map
