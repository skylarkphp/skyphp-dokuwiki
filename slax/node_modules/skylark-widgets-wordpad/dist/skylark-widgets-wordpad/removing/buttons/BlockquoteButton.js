/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,o,e,r){var a=r.inherit({});return a.prototype.name="blockquote",a.prototype.icon="quote-left",a.prototype.htmlTag="blockquote",a.prototype.disableTag="pre, table",a.prototype.command=function(){return this.editor.editable.blockquote(this.htmlTag,this.disableTag)},e.Toolbar.addButton(a),a});
//# sourceMappingURL=../../sourcemaps/removing/buttons/BlockquoteButton.js.map
