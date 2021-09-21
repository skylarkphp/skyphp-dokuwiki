define([
  "skylark-domx-query",
  "skylark-domx-plugins-panels/toolbar",
  "skylark-widgets-base/widget",
  "./toolbars",
  "./toolbar-item"
],function($,_Toolbar, Widget,toolbars,ToolbarItem){ 
  var Toolbar = Widget.inherit({
    klassName : "Toolbar",
    pluginName : "lark.wordpad.toolbar",

    options : {
      template : "<div class=\"domx-toolbar\"><ul></ul></div>"
    },

    _construct : function(parent,opts) {
      //this.editor =editor;
      Widget.prototype._construct.call(this,parent,opts);

    },

    _init : function() {
      this._xtoolbar = _Toolbar.instantiate(this._elm,this.options);
      this.buttons = [];
      //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
      //this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
      
      var actions = this.options.actions;
      for (var i = 0; i < actions.length; i++) {
        var action = actions[i];

        if (action.name === '|') {
          this._xtoolbar.addSeparator();
          continue;
        }

        var toolItemCtor = action.toolItemCtor;

        if (!toolItemCtor) {
          toolItemCtor = ToolbarItem;
        }

        this.buttons.push(new toolItemCtor({
          "action" : action,
          "toolbar" : this
        }));
      }
      //if (this.options.toolbarHidden) {
       // return this.wrapper.hide();
      //}
    },

    addToolItem : function(item) {
      this._xtoolbar.addToolItem(item);
    },

    findButton : function(name) {
      var button;
      button = this._xtoolbar.list.find('.toolbar-item-' + name).data('button');
      return button != null ? button : null;
    }
  });


  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return toolbars.Toolbar = Toolbar;

});