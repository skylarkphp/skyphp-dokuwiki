define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 


  var AutoSaveButton = Button.inherit({
    name : 'autosave',

    needFocus : false,

    _init : function() {
        Button.prototype._init.call(this);

	    var currentVal, link, name, val;
	    this.editor = this._module;
	    if (!this.opts.autosave) {
	      return;
	    }
	    this.name = typeof this.opts.autosave === 'string' ? this.opts.autosave : 'simditor';
	    if (this.opts.autosavePath) {
	      this.path = this.opts.autosavePath;
	    } else {
	      link = $("<a/>", {
	        href: location.href
	      });
	      name = this.editor.textarea.data('autosave') || this.name;
	      this.path = "/" + (link[0].pathname.replace(/\/$/g, "").replace(/^\//g, "")) + "/autosave/" + name + "/";
	    }
	    if (!this.path) {
	      return;
	    }
	    this.editor.on("valuechanged", (function(_this) {
	      return function() {
	        return _this.storage.set(_this.path, _this.editor.getValue());
	      };
	    })(this));
	    this.editor.el.closest('form').on('ajax:success.simditor-' + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.storage.remove(_this.path);
	      };
	    })(this));
	    val = this.storage.get(this.path);
	    if (!val) {
	      return;
	    }
	    currentVal = this.editor.textarea.val();
	    if (val === currentVal) {
	      return;
	    }
	    if (this.editor.textarea.is('[data-autosave-confirm]')) {
	      if (confirm(this.editor.textarea.data('autosave-confirm') || 'Are you sure to restore unsaved changes?')) {
	        return this.editor.setValue(val);
	      } else {
	        return this.storage.remove(this.path);
	      }
	    } else {
	      return this.editor.setValue(val);
	    }

    }



  });


  AutoSaveButton.pluginName = 'Autosave';

  AutoSaveButton.prototype.opts = {
    autosave: true,
    autosavePath: null
  };


  AutoSaveButton.prototype.storage = {
    supported: function() {
      var error;
      try {
        localStorage.setItem('_storageSupported', 'yes');
        localStorage.removeItem('_storageSupported');
        return true;
      } catch (_error) {
        error = _error;
        return false;
      }
    },
    set: function(key, val, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.setItem(key, val);
    },
    get: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage[key];
    },
    remove: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.removeItem(key);
    }
  };

  return AutoSaveButton;

});