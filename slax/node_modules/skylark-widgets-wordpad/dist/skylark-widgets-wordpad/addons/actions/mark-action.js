/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action","../../i18n"],function(e,t,r,i){var n=r.inherit({name:"mark",icon:"mark",htmlTag:"mark",disableTag:"pre, table",_execute:function(){var t,r,i;return i=this.editor.editable.selection.range(),this.active?(this.editor.editable.selection.save(),this.unmark(i),this.editor.editable.selection.restore(),void this.editor.trigger("valuechanged")):i.collapsed?void 0:(this.editor.editable.selection.save(),r=e(i.startContainer),t=e(i.endContainer),r.closest("mark").length&&i.setStartBefore(r.closest("mark")[0]),t.closest("mark").length&&i.setEndAfter(t.closest("mark")[0]),this.mark(i),this.editor.editable.selection.restore(),this.editor.trigger("valuechanged"),this.editor.editable.util.support.onselectionchange?this.editor.trigger("selectionchanged"):void 0)},mark:function(t){var r,i;return null==t&&(t=this.editor.editable.selection.range()),(r=e(t.extractContents())).find("mark").each(function(t,r){return e(r).replaceWith(e(r).html())}),i=e("<mark>").append(r),t.insertNode(i[0])},unmark:function(t){var r;return null==t&&(t=this.editor.editable.selection.range()),t.collapsed?(r=e(t.commonAncestorContainer)).is("mark")||(r=r.parent()):e(t.startContainer).closest("mark").length?r=e(t.startContainer).closest("mark"):e(t.endContainer).closest("mark").length&&(r=e(t.endContainer).closest("mark")),r.replaceWith(r.html())}});return t.actions.mark=n,n});
//# sourceMappingURL=../../sourcemaps/addons/actions/mark-action.js.map
