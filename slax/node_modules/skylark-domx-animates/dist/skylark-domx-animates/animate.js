/**
 * skylark-domx-animates - The skylark animates library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","skylark-domx-eventer","./animates"],function(a,n,e,s){return s.animate=function(a,t){return s.animateBaseClass&&(t=s.animateBaseClass+" "+t),n.addClass(a,t),e.one(a,s.animationEnd,function(){n.removeClass(a,t)}),this}});
//# sourceMappingURL=sourcemaps/animate.js.map
