define([
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function($,ToolButton,i18n,addons){ 

 var AlignmentButton = ToolButton.inherit({
    _doActive : function(align) {

      ToolButton.prototype._doActive.call(this, !!align);

      this.el.removeClass('align-left align-center align-right');
      if (align) {
        this.el.addClass('align-' + align);
      }
      this.setIcon('align-' + align);
      return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();

    }

  });


  addons.toolbar.items.alignment = AlignmentButton;

  return AlignmentButton;

});