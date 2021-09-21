define([
  "skylark-domx-query",
  "../../addons",
  "../../action"
],function($,addons,Action){ 
  

  var ItalicAction = Action.inherit({
      name : 'italic',

      icon : 'italic',

      htmlTag : 'i',

      disableTag : 'pre',

      shortcut : 'cmd+i',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + " ( Cmd + i )";
        } else {
          this.title = this.title + " ( Ctrl + i )";
          this.shortcut = 'ctrl+i';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('italic');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.italic();
      }
   });


   addons.actions.italic = ItalicAction; 

   return ItalicAction;

});