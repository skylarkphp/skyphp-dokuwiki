define([
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n",
  "./LinkPopover"
],function($,addons,Action,i18n,LinkPopover){ 
  

  var LinkAction = Action.inherit({
    name : 'link',

    icon : 'link',

    htmlTag : 'a',

    disableTag : 'pre',

    _status : function() {
     Action.prototype._status.call(this);
      if (this.active && !this.editor.editable.selection.rangeAtEndOf(this.node)) {
        if (!this.popover) {
          this.popover = new LinkPopover({
            action: this
          });
        }
        return this.popover.show(this.node);
      } else {
        if (this.popover) {
          return this.popover.hide();
        }
      }
    },

    _execute : function() {
      if (this.active) {
        this.popover.one('popovershow', (function(_this) {
          return function() {
            if (linkText) {
              _this.popover.urlEl.focus();
              return _this.popover.urlEl[0].select();
            } else {
              _this.popover.textEl.focus();
              return _this.popover.textEl[0].select();
            }
          };
        })(this));

      }

      return this.editor.editable.link(this.active,i18n.translate('linkText'));

    }

   });



  addons.actions.link = LinkAction; 

  return LinkAction;

});