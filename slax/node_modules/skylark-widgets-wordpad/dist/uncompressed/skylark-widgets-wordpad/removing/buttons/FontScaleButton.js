define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 
  
   var FontScaleButton = Button.inherit({

   });



  FontScaleButton.prototype.name = 'fontScale';

  FontScaleButton.prototype.icon = 'font';

  FontScaleButton.prototype.htmlTag = 'span';

  FontScaleButton.prototype.disableTag = 'pre, h1, h2, h3, h4, h5';


  FontScaleButton.prototype._init = function() {
    this.menu = [
      {
        name: '150%',
        text: i18n.translate('fontScaleXLarge'),
        param: '5'
      }, {
        name: '125%',
        text: i18n.translate('fontScaleLarge'),
        param: '4'
      }, {
        name: '100%',
        text: i18n.translate('fontScaleNormal'),
        param: '3'
      }, {
        name: '75%',
        text: i18n.translate('fontScaleSmall'),
        param: '2'
      }, {
        name: '50%',
        text: i18n.translate('fontScaleXSmall'),
        param: '1'
      }
    ];
    return Button.prototype._init.call(this);
  };

  FontScaleButton.prototype._activeStatus = function() {
    var active, endNode, endNodes, range, startNode, startNodes;
    range = this.editor.editable.selection.range();
    startNodes = this.editor.editable.selection.startNodes();
    endNodes = this.editor.editable.selection.endNodes();
    startNode = startNodes.filter('span[style*="font-size"]');
    endNode = endNodes.filter('span[style*="font-size"]');
    active = startNodes.length > 0 && endNodes.length > 0 && startNode.is(endNode);
    this.setActive(active);
    return this.active;
  };

  FontScaleButton.prototype.command = function(param) {
    return this.editor.editable.fontScale(param);
  };

  Wordpad.Toolbar.addButton(FontScaleButton);

  return FontScaleButton;

});