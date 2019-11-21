define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
  

   var HrButton = Button.inherit({

   });


  HrButton.prototype.name = 'hr';

  HrButton.prototype.icon = 'minus';

  HrButton.prototype.htmlTag = 'hr';

  HrButton.prototype._status = function() {};

  HrButton.prototype.command = function() {
    return this.editor.editable.hr();
  };

  Wordpad.Toolbar.addButton(HrButton);

  return HrButton;
	
});