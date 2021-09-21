/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action"],function(t,i,e){var o=e.inherit({name:"bold",icon:"bold",htmlTag:"b, strong",disableTag:"pre",shortcut:"cmd+b",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + b )":(this.title=this.title+" ( Ctrl + b )",this.shortcut="ctrl+b"),e.prototype._init.call(this)},_activeStatus:function(){var t;return t=this.editor.editable.isActive("bold"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.bold()}});return i.actions.bold=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/bold-action.js.map
