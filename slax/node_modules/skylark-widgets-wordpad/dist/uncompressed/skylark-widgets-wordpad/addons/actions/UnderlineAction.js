define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){
  var UnderlineAction = Action.inherit({
    name : 'underline',

    icon : 'underline',

    htmlTag : 'u',

    disableTag : 'pre',

    shortcut : 'cmd+u',

    render : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + u )';
      } else {
        this.title = this.title + ' ( Ctrl + u )';
        this.shortcut = 'ctrl+u';
      }
      return Action.prototype.render.call(this);
    },

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('underline');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.underline();
    }

   });


  addons.actions.underline = UnderlineAction;

  return UnderlineAction;

});