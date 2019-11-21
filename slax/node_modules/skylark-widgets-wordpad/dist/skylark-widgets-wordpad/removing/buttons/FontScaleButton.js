/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button","../i18n"],function(t,e,a,n,o){var r=n.inherit({});return r.prototype.name="fontScale",r.prototype.icon="font",r.prototype.htmlTag="span",r.prototype.disableTag="pre, h1, h2, h3, h4, h5",r.prototype._init=function(){return this.menu=[{name:"150%",text:o.translate("fontScaleXLarge"),param:"5"},{name:"125%",text:o.translate("fontScaleLarge"),param:"4"},{name:"100%",text:o.translate("fontScaleNormal"),param:"3"},{name:"75%",text:o.translate("fontScaleSmall"),param:"2"},{name:"50%",text:o.translate("fontScaleXSmall"),param:"1"}],n.prototype._init.call(this)},r.prototype._activeStatus=function(){var t,e,a,n,o;return this.editor.editable.selection.range(),o=this.editor.editable.selection.startNodes(),a=this.editor.editable.selection.endNodes(),n=o.filter('span[style*="font-size"]'),e=a.filter('span[style*="font-size"]'),t=o.length>0&&a.length>0&&n.is(e),this.setActive(t),this.active},r.prototype.command=function(t){return this.editor.editable.fontScale(t)},a.Toolbar.addButton(r),r});
//# sourceMappingURL=../../sourcemaps/removing/buttons/FontScaleButton.js.map
