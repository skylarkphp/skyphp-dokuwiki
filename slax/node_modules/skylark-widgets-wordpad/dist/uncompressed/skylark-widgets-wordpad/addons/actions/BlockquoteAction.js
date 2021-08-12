define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'blockquote',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.disableTag);
      }
   });


   addons.actions.blockquote = BlockquoteAction; 

   return BlockquoteAction;
});