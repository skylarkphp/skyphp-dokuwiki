/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","../../addons","../../action"],function(i,t,e,n){var a=n.inherit({name:"emoji",icon:"emoji",menu:!0,_init:function(){n.prototype._init.apply(this),i.merge(this.editor.editable.formatter._allowedAttributes.img,["data-emoji","alt"])}});return e.actions.emoji=a,a});
//# sourceMappingURL=../../sourcemaps/addons/actions/emoji-action.js.map
