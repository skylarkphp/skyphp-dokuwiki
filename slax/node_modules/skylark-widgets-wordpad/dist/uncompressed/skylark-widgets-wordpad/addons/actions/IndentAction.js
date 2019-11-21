define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var IndentAction = Action.inherit({
      name :'indent',

      icon : 'indent',

      _init : function() {
        var hotkey;
        hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
        this.title = this._t(this.name) + hotkey;
        return Action.prototype._init.call(this);
      },

      _execute : function() {
        return this.editor.editable.indent()
      }

   });


   addons.actions.indent = IndentAction; 

   return IndentAction;
});