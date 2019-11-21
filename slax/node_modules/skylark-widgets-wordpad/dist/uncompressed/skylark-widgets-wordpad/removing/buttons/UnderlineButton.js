define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){
  var UnderlineButton = Button.inherit({

   });


  UnderlineButton.prototype.name = 'underline';

  UnderlineButton.prototype.icon = 'underline';

  UnderlineButton.prototype.htmlTag = 'u';

  UnderlineButton.prototype.disableTag = 'pre';

  UnderlineButton.prototype.shortcut = 'cmd+u';

  UnderlineButton.prototype.render = function() {
    if (this.editor.editable.util.os.mac) {
      this.title = this.title + ' ( Cmd + u )';
    } else {
      this.title = this.title + ' ( Ctrl + u )';
      this.shortcut = 'ctrl+u';
    }
    return Button.prototype.render.call(this);
  };

  UnderlineButton.prototype._activeStatus = function() {
    var active;
    active = this.editor.editable.isActive('underline');
    this.setActive(active);
    return this.active;
  };

  UnderlineButton.prototype.command = function() {
    return this.editor.editable.underline();
  };


  Wordpad.Toolbar.addButton(UnderlineButton);

  return UnderlineButton;

});