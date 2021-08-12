/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","skylark-widgets-toolbars/ToolbarItem","../../../addons"],function(t,e,a){var i=e.inherit({_doActive:function(t){var a=!!t,i=t;if(e.prototype._doActive.call(this,a),a&&(i||(i=this.node[0].tagName.toLowerCase())),this.el.removeClass("active-p active-h1 active-h2 active-h3 active-h4 active-h5"),a)return this.el.addClass("active active-"+i)}});return a.toolbar.items.title=i,i});
//# sourceMappingURL=../../../sourcemaps/addons/toolbar/items/TitleButton.js.map
