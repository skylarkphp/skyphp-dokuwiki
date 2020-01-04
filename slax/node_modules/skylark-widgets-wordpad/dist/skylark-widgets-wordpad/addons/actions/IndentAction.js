/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action"],function(t,n,i){var e=i.inherit({name:"indent",icon:"indent",_init:function(){var t;return t=!1===this.editor.options.tabIndent?"":" (Tab)",this.title=this._t(this.name)+t,i.prototype._init.call(this)},_execute:function(){return this.editor.editable.indent()}});return n.actions.indent=e,e});
//# sourceMappingURL=../../sourcemaps/addons/actions/IndentAction.js.map
