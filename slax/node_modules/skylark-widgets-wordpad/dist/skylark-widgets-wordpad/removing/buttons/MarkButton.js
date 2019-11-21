/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button","../i18n"],function(e,t,r,o,n){var i=o.inherit({name:"mark"});return i.prototype.icon="mark",i.prototype.htmlTag="mark",i.prototype.disableTag="pre, table",i.prototype.command=function(){var t,r,o;return o=this.editor.editable.selection.range(),this.active?(this.editor.editable.selection.save(),this.unmark(o),this.editor.editable.selection.restore(),void this.editor.trigger("valuechanged")):o.collapsed?void 0:(this.editor.editable.selection.save(),r=e(o.startContainer),t=e(o.endContainer),r.closest("mark").length&&o.setStartBefore(r.closest("mark")[0]),t.closest("mark").length&&o.setEndAfter(t.closest("mark")[0]),this.mark(o),this.editor.editable.selection.restore(),this.editor.trigger("valuechanged"),this.editor.editable.util.support.onselectionchange?this.editor.trigger("selectionchanged"):void 0)},i.prototype.mark=function(t){var r,o;return null==t&&(t=this.editor.editable.selection.range()),(r=e(t.extractContents())).find("mark").each(function(t,r){return e(r).replaceWith(e(r).html())}),o=e("<mark>").append(r),t.insertNode(o[0])},i.prototype.unmark=function(t){var r;return null==t&&(t=this.editor.editable.selection.range()),t.collapsed?(r=e(t.commonAncestorContainer)).is("mark")||(r=r.parent()):e(t.startContainer).closest("mark").length?r=e(t.startContainer).closest("mark"):e(t.endContainer).closest("mark").length&&(r=e(t.endContainer).closest("mark")),r.replaceWith(r.html())},r.Toolbar.addButton(i),i});
//# sourceMappingURL=../../sourcemaps/removing/buttons/MarkButton.js.map
