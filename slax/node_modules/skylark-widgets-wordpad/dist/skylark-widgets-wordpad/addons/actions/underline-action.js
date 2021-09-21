/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action"],function(t,e,i){var n=i.inherit({name:"underline",icon:"underline",htmlTag:"u",disableTag:"pre",shortcut:"cmd+u",render:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + u )":(this.title=this.title+" ( Ctrl + u )",this.shortcut="ctrl+u"),i.prototype.render.call(this)},_activeStatus:function(){var t;return t=this.editor.editable.isActive("underline"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.underline()}});return e.actions.underline=n,n});
//# sourceMappingURL=../../sourcemaps/addons/actions/underline-action.js.map
