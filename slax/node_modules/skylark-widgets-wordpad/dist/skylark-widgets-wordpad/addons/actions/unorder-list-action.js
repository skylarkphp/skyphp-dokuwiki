/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","./list-action"],function(t,i,l){var e=l.inherit({type:"ul",name:"ul",icon:"listul",htmlTag:"ul",shortcut:"cmd+.",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + . )":(this.title=this.title+" ( Ctrl + . )",this.shortcut="ctrl+."),l.prototype._init.call(this)}});return i.actions.ul=e,e});
//# sourceMappingURL=../../sourcemaps/addons/actions/unorder-list-action.js.map
