define([
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var AlignmentAction = Action.inherit({
    name : "alignment",

    icon : 'alignLeft',
    
    htmlTag : 'p, h1, h2, h3, h4, td, th',

    _init : function() {
     Action.prototype._init.call(this);
     this.menu = [
          {
            name: 'left',
            text: i18n.translate('alignLeft'),
            icon: 'alignLeft',
            param: 'left'
          }, {
            name: 'center',
            text: i18n.translate('alignCenter'),
            icon: 'alignCenter',
            param: 'center'
          }, {
            name: 'right',
            text: i18n.translate('alignRight'),
            icon: 'alignRight',
            param: 'right'
          }
      ] ;    
    },


    _execute : function(align) {
      return this.editor.editable.alignment(align,this.htmlTag);
    },

    setActive : function(align) {
      if (align == null) {
        align = 'left';
      }
      if (align !== 'left' && align !== 'center' && align !== 'right') {
        align = 'left';
      }
      Action.prototype.setActive.call(this, align);
   },

    _status : function() {
      var value = this.editor.editable.status("alignment",this.htmlTag);
      if (value) {
        this.setDisabled(false);
        return this.setActive(value);
      } else {
        this.setDisabled(true);
        return this.setActive("left");
      }    
    }
  });
 
  return addons.actions.alignment = AlignmentAction;
});