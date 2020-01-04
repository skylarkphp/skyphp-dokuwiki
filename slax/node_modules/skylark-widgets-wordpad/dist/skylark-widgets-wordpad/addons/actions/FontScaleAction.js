/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(t,e,a,n){var i=a.inherit({name:"fontScale",icon:"fontScale",htmlTag:"span",disableTag:"pre, h1, h2, h3, h4, h5",_init:function(){return this.menu=[{name:"150%",text:n.translate("fontScaleXLarge"),param:"5"},{name:"125%",text:n.translate("fontScaleLarge"),param:"4"},{name:"100%",text:n.translate("fontScaleNormal"),param:"3"},{name:"75%",text:n.translate("fontScaleSmall"),param:"2"},{name:"50%",text:n.translate("fontScaleXSmall"),param:"1"}],a.prototype._init.call(this)},_activeStatus:function(){var t,e,a,n,i;return this.editor.editable.selection.range(),i=this.editor.editable.selection.startNodes(),a=this.editor.editable.selection.endNodes(),n=i.filter('span[style*="font-size"]'),e=a.filter('span[style*="font-size"]'),t=i.length>0&&a.length>0&&n.is(e),this.setActive(t),this.active},_execute:function(t){return this.editor.editable.fontScale(t)}});return e.actions.fontScale=i,i});
//# sourceMappingURL=../../sourcemaps/addons/actions/FontScaleAction.js.map
