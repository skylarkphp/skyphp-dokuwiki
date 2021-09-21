define([
  "skylark-domx-query",
  "skylark-widgets-toolbars/toolbar-item",
  "../../../addons"
],function($,ToolButton,addons){ 
  var TitleButton = ToolButton.inherit({
      _doActive : function(value) {
        var active = !!value,
            param = value;
        ToolButton.prototype._doActive.call(this, active);

        if (active) {
          param || (param = this.node[0].tagName.toLowerCase());
        }
        this.el.removeClass('active-p active-h1 active-h2 active-h3 active-h4 active-h5');
        if (active) {
          return this.el.addClass('active active-' + param);
        }
      }
   });


  addons.toolbar.items.title = TitleButton;

  return TitleButton;

});