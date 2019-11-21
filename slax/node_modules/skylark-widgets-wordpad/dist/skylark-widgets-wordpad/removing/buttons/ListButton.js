/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-noder","skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,e,o,r,i){var a=i.inherit({});return a.prototype.type="",a.prototype.disableTag="pre, table",a.prototype.command=function(t){return this.editor.editable.list(this.type,t,this.disableTag)},a});
//# sourceMappingURL=../../sourcemaps/removing/buttons/ListButton.js.map
