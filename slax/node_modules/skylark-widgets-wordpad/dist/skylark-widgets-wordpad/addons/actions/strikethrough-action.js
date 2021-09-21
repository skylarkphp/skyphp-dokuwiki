/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action"],function(t,e,i){var r=i.inherit({name:"strikethrough",icon:"strikethrough",htmlTag:"strike",disableTag:"pre",_activeStatus:function(){var t;return t=this.editor.editable.isActive("strikethrough"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.strikethrough()}});return e.actions.strikethrough=r});
//# sourceMappingURL=../../sourcemaps/addons/actions/strikethrough-action.js.map
