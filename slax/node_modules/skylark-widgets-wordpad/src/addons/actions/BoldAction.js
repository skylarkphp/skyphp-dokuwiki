define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
    var BoldAction = Action.inherit({
      name : 'bold',

      icon : 'bold',

      htmlTag : 'b, strong',

      disableTag : 'pre',

      shortcut : 'cmd+b',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + b )';
        } else {
          this.title = this.title + ' ( Ctrl + b )';
          this.shortcut = 'ctrl+b';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('bold');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.bold();
      }

    });


    addons.actions.bold = BoldAction; 

    return BoldAction;
});