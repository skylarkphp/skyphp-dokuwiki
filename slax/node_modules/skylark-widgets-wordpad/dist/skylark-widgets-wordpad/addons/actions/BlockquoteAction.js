/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action"],function(e,t,o){var i=o.inherit({name:"blockquote",icon:"blockquote",htmlTag:"blockquote",disableTag:"pre, table",_execute:function(){return this.editor.editable.blockquote(this.disableTag)}});return t.actions.blockquote=i,i});
//# sourceMappingURL=../../sourcemaps/addons/actions/BlockquoteAction.js.map
