define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-toolbars/ToolbarItem",
  "../../../i18n",
  "../../../addons"
],function(langx,$,ToolButton,i18n,addons){ 

 var AlignmentButton = ToolButton.inherit({
    _doActive : function(align) {

      ToolButton.prototype._doActive.call(this, !!align);

      this.el.removeClass('alignLeft alignCenter alignRight');
      if (align) {
        this.el.addClass('align' + langx.upperFirst(align));
      }
      this.setIcon('align' + langx.upperFirst(align));
      return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();

    }

  });


  addons.toolbar.items.alignment = AlignmentButton;

  return AlignmentButton;

});