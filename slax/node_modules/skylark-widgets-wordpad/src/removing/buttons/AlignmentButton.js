define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 
   var AlignmentButton = Button.inherit({

    });


  AlignmentButton.prototype.name = "alignment";

  AlignmentButton.prototype.icon = 'align-left';

  AlignmentButton.prototype.htmlTag = 'p, h1, h2, h3, h4, td, th';

  AlignmentButton.prototype._init = function() {
    this.menu = [
      {
        name: 'left',
        text: i18n.translate('alignLeft'),
        icon: 'align-left',
        param: 'left'
      }, {
        name: 'center',
        text: i18n.translate('alignCenter'),
        icon: 'align-center',
        param: 'center'
      }, {
        name: 'right',
        text: i18n.translate('alignRight'),
        icon: 'align-right',
        param: 'right'
      }
    ];
    return Button.prototype._init.call(this);
  };

  AlignmentButton.prototype.setActive = function(active, align) {
    if (align == null) {
      align = 'left';
    }
    if (align !== 'left' && align !== 'center' && align !== 'right') {
      align = 'left';
    }
    if (align === 'left') {
      Button.prototype.setActive.call(this, false);
    } else {
      Button.prototype.setActive.call(this, active);
    }
    this.el.removeClass('align-left align-center align-right');
    if (active) {
      this.el.addClass('align-' + align);
    }
    this.setIcon('align-' + align);
    return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();
  };

  AlignmentButton.prototype._status = function() {
    var value = this.editor.editable.status("alignment",this.htmlTag);
    if (value) {
      this.setDisabled(false);
      return this.setActive(true, value);
    } else {
      this.setDisabled(true);
      return this.setActive(false);
    }    
  };

  AlignmentButton.prototype.command = function(align) {
    return this.editor.editable.alignment(align,this.htmlTag);
  };

  Wordpad.Toolbar.addButton(AlignmentButton);

  return AlignmentButton;

});