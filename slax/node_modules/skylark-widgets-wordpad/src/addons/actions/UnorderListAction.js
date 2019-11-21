define([
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
   var UnorderListAction = ListAction.inherit({
      type : 'ul',

      name : 'ul',

      icon : 'list-ul',

      htmlTag : 'ul',

      shortcut : 'cmd+.',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + . )';
        } else {
          this.title = this.title + ' ( Ctrl + . )';
          this.shortcut = 'ctrl+.';
        }
        return ListAction.prototype._init.call(this);
      }

   });


    addons.actions.ul = UnorderListAction;

    return UnorderListAction;

});