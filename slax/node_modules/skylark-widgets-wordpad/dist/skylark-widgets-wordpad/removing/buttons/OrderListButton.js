/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","./ListButton"],function(t,o,i,r){var e=r.inherit({});return e.prototype.type="ol",e.prototype.name="ol",e.prototype.icon="list-ol",e.prototype.htmlTag="ol",e.prototype.shortcut="cmd+/",e.prototype._init=function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + / )":(this.title=this.title+" ( ctrl + / )",this.shortcut="ctrl+/"),r.prototype._init.call(this)},i.Toolbar.addButton(e),e});
//# sourceMappingURL=../../sourcemaps/removing/buttons/OrderListButton.js.map
