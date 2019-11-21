define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 
  var TitleButton = Button.inherit({

   });

  TitleButton.prototype.name = 'title';

  TitleButton.prototype.htmlTag = 'h1, h2, h3, h4, h5';

  TitleButton.prototype.disableTag = 'pre, table';

  TitleButton.prototype._init = function() {
    this.menu = [
      {
        name: 'normal',
        text: i18n.translate('normalText'),
        param: 'p'
      }, '|', {
        name: 'h1',
        text: i18n.translate('title') + ' 1',
        param: 'h1'
      }, {
        name: 'h2',
        text: i18n.translate('title') + ' 2',
        param: 'h2'
      }, {
        name: 'h3',
        text: i18n.translate('title') + ' 3',
        param: 'h3'
      }, {
        name: 'h4',
        text: i18n.translate('title') + ' 4',
        param: 'h4'
      }, {
        name: 'h5',
        text: i18n.translate('title') + ' 5',
        param: 'h5'
      }
    ];
    return Button.prototype._init.call(this);
  };

  TitleButton.prototype.setActive = function(active, param) {
    Button.prototype.setActive.call(this, active);
    if (active) {
      param || (param = this.node[0].tagName.toLowerCase());
    }
    this.el.removeClass('active-p active-h1 active-h2 active-h3 active-h4 active-h5');
    if (active) {
      return this.el.addClass('active active-' + param);
    }
  };

  TitleButton.prototype.command = function(param) {
    return this.editor.editable.title(param,this.disableTag);
  };

  Wordpad.Toolbar.addButton(TitleButton);

  return TitleButton;

});