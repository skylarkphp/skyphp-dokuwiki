/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action"],function(t,n,i){var e=i.inherit({name:"outdent",icon:"outdent",_init:function(){var t;return t=!1===this.editor.options.tabIndent?"":" (Shift + Tab)",this.title=this._t(this.name)+t,i.prototype._init.call(this)},_status:function(){},_execute:function(){return this.editor.editable.outdent()}});return n.actions.outdent=e,e});
//# sourceMappingURL=../../sourcemaps/addons/actions/OutdentAction.js.map
