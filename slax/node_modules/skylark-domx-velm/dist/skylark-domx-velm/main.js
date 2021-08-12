/**
 * skylark-domx-velm - The skylark velm library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./velm","skylark-domx-styler"],function(o,t){o.delegate(["addClass","className","css","hasClass","hide","isInvisible","removeClass","show","toggleClass"],t);return["position","left","top","right","bottom","width","height","border","borderLeft","borderTop","borderRight","borderBottom","borderColor","display","overflow","margin","marginLeft","marginTop","marginRight","marginBottom","padding","paddingLeft","paddingTop","paddingRight","paddingBottom","color","background","backgroundColor","opacity","fontSize","fontWeight","textAlign","textDecoration","textTransform","cursor","zIndex"].forEach(function(t){var r=t;o.VisualElement.prototype[r]=function(o){return this.css(t,o),this}}),o});
//# sourceMappingURL=sourcemaps/main.js.map
