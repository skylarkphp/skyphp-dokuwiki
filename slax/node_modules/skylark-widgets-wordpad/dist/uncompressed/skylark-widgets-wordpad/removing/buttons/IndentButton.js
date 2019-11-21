define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
  
   var IndentButton = Button.inherit({

   });


  IndentButton.prototype.name = 'indent';

  IndentButton.prototype.icon = 'indent';

  IndentButton.prototype._init = function() {
    var hotkey;
    hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
    this.title = this._t(this.name) + hotkey;
    return Button.prototype._init.call(this);
  };

  IndentButton.prototype._status = function() {};

  IndentButton.prototype.command = function() {
    return this.editor.editable.indent();
  };

  Wordpad.Toolbar.addButton(IndentButton);	

  return IndentButton;
});