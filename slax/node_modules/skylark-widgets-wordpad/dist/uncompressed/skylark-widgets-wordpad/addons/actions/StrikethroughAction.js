define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
  var StrikethroughAction = Action.inherit({
    name : 'strikethrough',

    icon : 'strikethrough',

    htmlTag : 'strike',

    disableTag : 'pre',

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('strikethrough');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.strikethrough();
    }

  });


  return addons.actions.strikethrough = StrikethroughAction;	
});