/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../../ToolButton","../../../i18n","../../../addons"],function(e,i,n,t){var l=i.inherit({_doActive:function(e){return i.prototype._doActive.call(this,!!e),this.el.removeClass("align-left align-center align-right"),e&&this.el.addClass("align-"+e),this.setIcon("align-"+e),this.menuEl.find(".menu-item").show().end().find(".menu-item-"+e).hide()}});return t.toolbar.items.alignment=l,l});
//# sourceMappingURL=../../../sourcemaps/addons/toolbar/items/AlignmentButton.js.map
