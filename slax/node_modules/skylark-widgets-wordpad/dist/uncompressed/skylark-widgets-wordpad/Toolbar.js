define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-swt/Toolbar",
  "./ToolButton",
  "./addons"
],function(langx,$,_Toolbar, ToolButton,addons){ 

  var Toolbar = _Toolbar.inherit({
    pluginName : "lark.Wordpad.toolbar",

    _construct : function(editor,opts) {
      this.editor =editor;
      _Toolbar.prototype._construct.call(this,opts);
    },

    _init : function() {
      _Toolbar.prototype._init.call(this);
      this._render();
    }

  });

  Toolbar.prototype._render = function() {
    var k, len, name, ref;
    this.buttons = [];
    //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
    this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
    ref = this.opts.toolbar;
    for (k = 0, len = ref.length; k < len; k++) {
      name = ref[k];
      if (name === '|') {
        this.addSeparator();
        continue;
      }

      var action  = this.editor.findAction(name),
          toolItemCtor = addons.toolbar.items[name];

      if (!toolItemCtor) {
        toolItemCtor = ToolButton;
      }

      this.buttons.push(new toolItemCtor({
        "action" : action,
        "toolbar" : this
      }));
    }
    if (this.opts.toolbarHidden) {
      return this.wrapper.hide();
    }
  };

  Toolbar.prototype.findButton = function(name) {
    var button;
    button = this.list.find('.toolbar-item-' + name).data('button');
    return button != null ? button : null;
  };

  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return Toolbar;

});