define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n",
  "./LinkPopover"
],function($,Toolbar,Wordpad,Button,i18n,LinkPopover){ 
  

  var LinkButton = Button.inherit({

   });


  LinkButton.prototype.name = 'link';

  LinkButton.prototype.icon = 'link';

  LinkButton.prototype.htmlTag = 'a';

  LinkButton.prototype.disableTag = 'pre';

  LinkButton.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Button.prototype.render.apply(this, args);
    return this.popover = new LinkPopover({
      button: this
    });
  };

  LinkButton.prototype._status = function() {
   Button.prototype._status.call(this);
    if (this.active && !this.editor.editable.selection.rangeAtEndOf(this.node)) {
      return this.popover.show(this.node);
    } else {
      return this.popover.hide();
    }
  };

  LinkButton.prototype.command = function() {
    if (this.active) {
      this.popover.one('popovershow', (function(_this) {
        return function() {
          if (linkText) {
            _this.popover.urlEl.focus();
            return _this.popover.urlEl[0].select();
          } else {
            _this.popover.textEl.focus();
            return _this.popover.textEl[0].select();
          }
        };
      })(this));

    }

    return this.editor.editable.link(this.active,i18n.translate('linkText'));

  };

  Wordpad.Toolbar.addButton(LinkButton);

  return LinkButton;

});