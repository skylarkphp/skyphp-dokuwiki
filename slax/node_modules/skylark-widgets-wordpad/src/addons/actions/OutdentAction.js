define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  var OutdentAction = Action.inherit({
    name : 'outdent',

    icon : 'outdent',

    _init : function() {
      var hotkey;
      hotkey = this.editor.options.tabIndent === false ? '' : ' (Shift + Tab)';
      this.title = this._t(this.name) + hotkey;
      return Action.prototype._init.call(this);
    },

    _status : function() {},

    _execute : function() {
      return this.editor.editable.outdent();
    }

   });


   addons.actions.outdent = OutdentAction; 
 
   return OutdentAction;

});