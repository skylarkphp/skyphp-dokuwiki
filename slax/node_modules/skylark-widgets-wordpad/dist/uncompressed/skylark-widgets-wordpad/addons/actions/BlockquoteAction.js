define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'quote-left',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
      }
   });


   addons.actions.blockquote = BlockquoteAction; 

   return BlockquoteAction;
});