/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-domx-styler","skylark-widgets-base/addon"],function(s,i){return class extends i{_init(){this.coder=this._widget,this.options.pluginCssClass=this.options.pluginClass||"codeg-plugin-"+this.constructor.addonName,this.options.pluginCssClass&&s.addClass(this._widget._elm,this.options.pluginCssClass)}}});
//# sourceMappingURL=sourcemaps/addon.js.map
