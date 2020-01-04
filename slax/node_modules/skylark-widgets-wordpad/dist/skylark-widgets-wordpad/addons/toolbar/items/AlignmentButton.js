/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","../../../ToolButton","../../../i18n","../../../addons"],function(e,i,n,t,l){var a=n.inherit({_doActive:function(i){return n.prototype._doActive.call(this,!!i),this.el.removeClass("alignLeft alignCenter alignRight"),i&&this.el.addClass("align"+e.upperFirst(i)),this.setIcon("align"+e.upperFirst(i)),this.menuEl.find(".menu-item").show().end().find(".menu-item-"+i).hide()}});return l.toolbar.items.alignment=a,a});
//# sourceMappingURL=../../../sourcemaps/addons/toolbar/items/AlignmentButton.js.map
