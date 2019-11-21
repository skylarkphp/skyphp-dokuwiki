define([
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  
  var FontScaleAction = Action.inherit({
    name : 'fontScale',

    icon : 'font',

    htmlTag : 'span',

    disableTag : 'pre, h1, h2, h3, h4, h5',


    _init : function() {
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
      return Action.prototype._init.call(this);
    },

    _activeStatus : function() {
      var active, endNode, endNodes, range, startNode, startNodes;
      range = this.editor.editable.selection.range();
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      startNode = startNodes.filter('span[style*="font-size"]');
      endNode = endNodes.filter('span[style*="font-size"]');
      active = startNodes.length > 0 && endNodes.length > 0 && startNode.is(endNode);
      this.setActive(active);
      return this.active;
    },

    _execute : function(param) {
      return this.editor.editable.fontScale(param);
    }
  });


  addons.actions.fontScale = FontScaleAction; 

  return FontScaleAction;
});