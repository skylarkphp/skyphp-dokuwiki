define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 


  var MarkButton = Button.inherit({
    name : 'mark'

  });


  MarkButton.prototype.icon = 'mark';

  MarkButton.prototype.htmlTag = 'mark';

  MarkButton.prototype.disableTag = 'pre, table';

  MarkButton.prototype.command = function() {
    var $end, $start, range;
    range = this.editor.editable.selection.range();
    if (this.active) {
      this.editor.editable.selection.save();
      this.unmark(range);
      this.editor.editable.selection.restore();
      this.editor.trigger('valuechanged');
      return;
    }
    if (range.collapsed) {
      return;
    }
    this.editor.editable.selection.save();
    $start = $(range.startContainer);
    $end = $(range.endContainer);
    if ($start.closest('mark').length) {
      range.setStartBefore($start.closest('mark')[0]);
    }
    if ($end.closest('mark').length) {
      range.setEndAfter($end.closest('mark')[0]);
    }
    this.mark(range);
    this.editor.editable.selection.restore();
    this.editor.trigger('valuechanged');
    if (this.editor.editable.util.support.onselectionchange) {
      return this.editor.trigger('selectionchanged');
    }
  };

  MarkButton.prototype.mark = function(range) {
    var $contents, $mark;
    if (range == null) {
      range = this.editor.editable.selection.range();
    }
    $contents = $(range.extractContents());
    $contents.find('mark').each(function(index, ele) {
      return $(ele).replaceWith($(ele).html());
    });
    $mark = $('<mark>').append($contents);
    return range.insertNode($mark[0]);
  };

  MarkButton.prototype.unmark = function(range) {
    var $mark;
    if (range == null) {
      range = this.editor.editable.selection.range();
    }
    if (range.collapsed) {
      $mark = $(range.commonAncestorContainer);
      if (!$mark.is('mark')) {
        $mark = $mark.parent();
      }
    } else if ($(range.startContainer).closest('mark').length) {
      $mark = $(range.startContainer).closest('mark');
    } else if ($(range.endContainer).closest('mark').length) {
      $mark = $(range.endContainer).closest('mark');
    }
    return $mark.replaceWith($mark.html());
  };  

  
  Wordpad.Toolbar.addButton(MarkButton);

  return MarkButton;

 }); 