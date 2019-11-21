define([
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var TitleAction = Action.inherit({
    name : 'title',

    htmlTag : 'h1, h2, h3, h4, h5',

    disableTag : 'pre, table',

    _init : function() {
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
      return Action.prototype._init.call(this);
    },

    setActive : function(active, param) {
      if (active) {
        active = this.node[0].tagName.toLowerCase();
      }
      Action.prototype.setActive.call(this, active);
    },

    _execute : function(param) {
      return this.editor.editable.title(param,this.disableTag);
    }

  });

  addons.actions.title = TitleAction;

  return TitleAction;

});