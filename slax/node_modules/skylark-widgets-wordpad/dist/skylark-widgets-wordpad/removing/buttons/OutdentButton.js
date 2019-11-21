/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,o,n,e){var i=e.inherit({});return i.prototype.name="outdent",i.prototype.icon="outdent",i.prototype._init=function(){var t;return t=!1===this.editor.opts.tabIndent?"":" (Shift + Tab)",this.title=this._t(this.name)+t,e.prototype._init.call(this)},i.prototype._status=function(){},i.prototype.command=function(){return this.editor.editable.outdent()},n.Toolbar.addButton(i),i});
//# sourceMappingURL=../../sourcemaps/removing/buttons/OutdentButton.js.map
