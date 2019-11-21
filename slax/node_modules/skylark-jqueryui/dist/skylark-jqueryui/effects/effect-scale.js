/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect","./effect-size"],function(e){return e.effects.define("scale",function(t,f){var i=e(this),n=t.mode,c=parseInt(t.percent,10)||(0===parseInt(t.percent,10)?0:"effect"!==n?0:100),s=e.extend(!0,{from:e.effects.scaledDimensions(i),to:e.effects.scaledDimensions(i,c,t.direction||"both"),origin:t.origin||["middle","center"]},t);t.fade&&(s.from.opacity=1,s.to.opacity=0),e.effects.effect.size.call(this,s,f)})});
//# sourceMappingURL=../sourcemaps/effects/effect-scale.js.map
