/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-langx/Evented","./base"],function(n,i,t){var s=i.inherit({_construct:function(i,t){this._widget=i,Object.defineProperty(this,"options",{value:n.mixin({},this.options,t,!0)}),this._init&&this._init()}});return s.register=function(n){var i=this.categoryName,t=this.addonName;i&&t&&(n.addons=n.addons||{},n.addons[i]=n.addons[i]||{},n.addons[i][t]=this)},t.Addon=s});
//# sourceMappingURL=sourcemaps/Addon.js.map
