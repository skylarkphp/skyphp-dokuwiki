/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","skylark-widgets-toolbars/toolbar-item","../../../addons"],function(t,e,i){var a=e.inherit({_doActive:function(t){var i=!!t,a=t;if(e.prototype._doActive.call(this,i),i&&(a||(a=this.node[0].tagName.toLowerCase())),this.el.removeClass("active-p active-h1 active-h2 active-h3 active-h4 active-h5"),i)return this.el.addClass("active active-"+a)}});return i.toolbar.items.title=a,a});
//# sourceMappingURL=../../../sourcemaps/addons/toolbar/items/title-button.js.map
