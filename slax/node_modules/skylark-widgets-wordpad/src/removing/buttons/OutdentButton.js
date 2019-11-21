define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
  var OutdentButton = Button.inherit({

   });


  OutdentButton.prototype.name = 'outdent';

  OutdentButton.prototype.icon = 'outdent';

  OutdentButton.prototype._init = function() {
    var hotkey;
    hotkey = this.editor.opts.tabIndent === false ? '' : ' (Shift + Tab)';
    this.title = this._t(this.name) + hotkey;
    return Button.prototype._init.call(this);
  };

  OutdentButton.prototype._status = function() {};

  OutdentButton.prototype.command = function() {
    return this.editor.editable.outdent();
  };

  Wordpad.Toolbar.addButton(OutdentButton);	

  return OutdentButton;

});