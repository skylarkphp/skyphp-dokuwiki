/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","skylark-langx/Evented","./base"],function(n,t,i){var s=t.inherit({_construct:function(t,i){this._widget=t,Object.defineProperty(this,"options",{value:n.mixin({},this.options,i,!0)}),this._init&&this._init()}});return s.register=function(n){var t=this.categoryName,i=this.addonName;t&&i&&(n.addons=n.addons||{},n.addons[t]=n.addons[t]||{},n.addons[t][i]=this)},i.Addon=s});
//# sourceMappingURL=sourcemaps/addon.js.map
