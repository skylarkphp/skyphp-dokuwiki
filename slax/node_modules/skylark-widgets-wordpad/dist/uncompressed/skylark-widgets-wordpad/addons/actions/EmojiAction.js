define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(langx,$,addons,Action){ 
  var EmojiAction = Action.inherit({
    name : 'emoji',

    icon : 'emoji',

    menu : true,

    _init : function() {
      Action.prototype._init.apply(this);
      langx.merge(this.editor.editable.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
    }

  });


  addons.actions.emoji = EmojiAction; 

  return EmojiAction;
	
});