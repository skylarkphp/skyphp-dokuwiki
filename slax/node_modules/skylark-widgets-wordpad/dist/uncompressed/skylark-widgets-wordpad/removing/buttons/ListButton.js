define([
  "skylark-domx-noder",
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function(noder,$,Toolbar,Wordpad,Button){ 
  var ListButton = Button.inherit({

   });


    ListButton.prototype.type = '';

    ListButton.prototype.disableTag = 'pre, table';

    ListButton.prototype.command = function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    };

    return ListButton;
	
});