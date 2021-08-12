define([
	"skylark-domx-styler",
	"skylark-widgets-base/Addon"
],function(styler,_Addon){
	return class Addon extends _Addon {
		_init() {
            this.coder = this._widget;

            this.options.pluginCssClass = this.options.pluginClass || ("coder-plugin-" + this.constructor.addonName);

			if (this.options.pluginCssClass) {
	            styler.addClass(this._widget._elm, this.options.pluginCssClass);			
			}

		}

	}
})