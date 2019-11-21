/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,i,e,o){var r=o.inherit({});return r.prototype.name="italic",r.prototype.icon="italic",r.prototype.htmlTag="i",r.prototype.disableTag="pre",r.prototype.shortcut="cmd+i",r.prototype._init=function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + i )":(this.title=this.title+" ( Ctrl + i )",this.shortcut="ctrl+i"),o.prototype._init.call(this)},r.prototype._activeStatus=function(){var t;return t=this.editor.editable.isActive("italic"),this.setActive(t),this.active},r.prototype.command=function(){return this.editor.editable.italic()},e.Toolbar.addButton(r),r});
//# sourceMappingURL=../../sourcemaps/removing/buttons/ItalicButton.js.map
