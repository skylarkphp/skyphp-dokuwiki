/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","./ListAction"],function(t,i,l){var o=l.inherit({type:"ol",name:"ol",icon:"listol",htmlTag:"ol",shortcut:"cmd+/",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + / )":(this.title=this.title+" ( ctrl + / )",this.shortcut="ctrl+/"),l.prototype._init.call(this)}});return i.actions.ol=o});
//# sourceMappingURL=../../sourcemaps/addons/actions/OrderListAction.js.map
