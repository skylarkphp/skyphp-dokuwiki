/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,o,r,n){var e=n.inherit({});return e.prototype.name="hr",e.prototype.icon="minus",e.prototype.htmlTag="hr",e.prototype._status=function(){},e.prototype.command=function(){return this.editor.editable.hr()},r.Toolbar.addButton(e),e});
//# sourceMappingURL=../../sourcemaps/removing/buttons/HrButton.js.map
