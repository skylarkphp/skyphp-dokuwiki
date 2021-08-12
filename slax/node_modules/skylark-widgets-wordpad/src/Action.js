define([
  "skylark-langx/langx",
  "skylark-widgets-base/actions/Action",
  "./Wordpad",
  "./i18n"
],function(langx, _Action, Wordpad,i18n){ 
  var slice = [].slice;

  var Action = _Action.inherit( {
    htmlTag : '',

    disableTag : '',

    menu : false,

    active : {
      get : function() {
        return this.state.get("active");
      },

      set : function(value) {
        return this.state.set("active",value);

      }

    },

    disabled : {
      get : function() {
        return this.state.get("disabled");
      },

      set : function(value) {
        return this.state.set("disabled",value);

      }
    },

    needFocus : true,

    _construct  : function(opts) {
      _Action.prototype._construct.call(this,opts);
      //this.toolbar = opts.toolbar;
      //this.editor = this.toolbar.editor;
      this.title = i18n.translate(this.name);

      var _this = this;

      this.editor.on('blur', function() {
        var editorActive;
        editorActive = _this.editor.body.is(':visible') && _this.editor.body.is('[contenteditable]');
        if (!(editorActive && !_this.editor.editable.clipboard.pasting)) {
          return;
        }
        _this.setActive(false);
        return _this.setDisabled(false);
      });

      if (this.shortcut != null) {
        this.editor.editable.hotkeys.add(this.shortcut, function(e) {
          //_this.el.mousedown();
          _this.execute();
          return false;
        });
      }

      var ref = this.htmlTag.split(',');
      for (k = 0, len = ref.length; k < len; k++) {
        tag = ref[k];
        tag = langx.trim(tag);
        if (tag && langx.inArray(tag, this.editor.editable.formatter._allowedTags) < 0) {
          this.editor.editable.formatter._allowedTags.push(tag);
        }
      }
      this.editor.on('selectionchanged', function(e) {
        if (_this.editor.editable.inputManager.focused) {
          return _this._status();
        }
      });

      this._init();
    },

    _init : function() {


    },

    _disableStatus : function() {
      var disabled, endNodes, startNodes;
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      disabled = startNodes.filter(this.disableTag).length > 0 || endNodes.filter(this.disableTag).length > 0;
      this.setDisabled(disabled);
      if (this.disabled) {
        this.setActive(false);
      }
      return this.disabled;
    },

    _activeStatus : function() {
      var active, endNode, endNodes, startNode, startNodes;
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      startNode = startNodes.filter(this.htmlTag);
      endNode = endNodes.filter(this.htmlTag);
      active = startNode.length > 0 && endNode.length > 0 && startNode.is(endNode);
      this.node = active ? startNode : null;
      this.setActive(active);
      return this.active;
    },

    _status : function() {
      this._disableStatus();
      if (this.disabled) {
        return;
      }
      return this._activeStatus();
    },

    setActive : function(active) {
      if (active === this.active) {
        return;
      }
      this.active = active;
    },

    setDisabled : function(disabled) {
      if (disabled === this.disabled) {
        return;
      }
      this.disabled = disabled;
    }
  }); 


  Action.prototype._t = i18n.translate;

  Action.i18n = i18n;
  
  return Action;

});