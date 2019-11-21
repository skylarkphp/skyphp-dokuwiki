/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect","./effect-scale"],function(e){return e.effects.define("puff","hide",function(f,t){var c=e.extend(!0,{},f,{fade:!0,percent:parseInt(f.percent,10)||150});e.effects.effect.scale.call(this,c,t)})});
//# sourceMappingURL=../sourcemaps/effects/effect-puff.js.map
