define([
  "skylark-domx-noder",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(noder,$,addons,Action){ 
  var ListAction = Action.inherit({
    type : '',

    disableTag : 'pre, table',

    _execute : function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    }

   });



    return ListAction;
	
});