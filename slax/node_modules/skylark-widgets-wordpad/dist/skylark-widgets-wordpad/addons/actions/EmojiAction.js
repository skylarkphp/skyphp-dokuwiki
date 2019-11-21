/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","../../addons","../../Action"],function(i,t,e,n){var o=n.inherit({name:"emoji",icon:"smile-o",menu:!0,_init:function(){n.prototype._init.apply(this),i.merge(this.editor.editable.formatter._allowedAttributes.img,["data-emoji","alt"])}});return e.actions.emoji=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/EmojiAction.js.map
