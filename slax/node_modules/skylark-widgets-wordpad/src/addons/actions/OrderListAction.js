define([
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
  var OrderListAction = ListAction.inherit({
    type : 'ol',

    name : 'ol',

    icon : 'listol',

    htmlTag : 'ol',

    shortcut : 'cmd+/',

    _init : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + / )';
      } else {
        this.title = this.title + ' ( ctrl + / )';
        this.shortcut = 'ctrl+/';
      }
      return ListAction.prototype._init.call(this);
    }

   });

    return addons.actions.ol = OrderListAction;	
});