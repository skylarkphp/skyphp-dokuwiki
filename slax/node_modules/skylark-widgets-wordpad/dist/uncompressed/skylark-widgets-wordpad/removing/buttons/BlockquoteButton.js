define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
   var BlockquoteButton = Button.inherit({

   });

  BlockquoteButton.prototype.name = 'blockquote';

  BlockquoteButton.prototype.icon = 'quote-left';

  BlockquoteButton.prototype.htmlTag = 'blockquote';

  BlockquoteButton.prototype.disableTag = 'pre, table';

  BlockquoteButton.prototype.command = function() {
    return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
  };

  Wordpad.Toolbar.addButton(BlockquoteButton); 

  return BlockquoteButton;

});