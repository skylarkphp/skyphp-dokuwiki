define([
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var HrAction = Action.inherit({

	  name : 'hr',

	  icon : 'minus',

	  htmlTag : 'hr',

	  _status : function() {},

	  _execute : function() {
	    return this.editor.editable.hr();
	  }

   });


  addons.actions.hr = HrAction; 

  return HrAction;	
});