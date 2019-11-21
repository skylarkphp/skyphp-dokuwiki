define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
  
  var StrikethroughButton = Button.inherit({

   });


  StrikethroughButton.prototype.name = 'strikethrough';

  StrikethroughButton.prototype.icon = 'strikethrough';

  StrikethroughButton.prototype.htmlTag = 'strike';

  StrikethroughButton.prototype.disableTag = 'pre';

  StrikethroughButton.prototype._activeStatus = function() {
    var active;
    active = this.editor.editable.isActive('strikethrough');
    this.setActive(active);
    return this.active;
  };

  StrikethroughButton.prototype.command = function() {
    return this.editor.editable.strikethrough();
  };

  Wordpad.Toolbar.addButton(StrikethroughButton);	

  return StrikethroughButton;

});