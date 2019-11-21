define([
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-contents/Editable",
  "skylark-widgets-base/Widget",
  "./Toolbar",
  "./uploader",
  "./i18n",
  "./addons"

],function(skylark,langx, $, Editable,Widget,Toolbar,uploader,i18n,addons){ 

  var Wordpad = Widget.inherit({
      options : {
        srcNodeRef: null,
        placeholder: '',
        defaultImage: 'images/image.png',
        params: {},
        upload: false,
        template : "<div class=\"wordpad\">\n  <div class=\"wordpad-wrapper\">\n    <div class=\"wordpad-placeholder\"></div>\n    <div class=\"wordpad-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>"
      },


    _init : function() {
      this._actions = [];

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;

      var e, editor, uploadOpts;
      this.textarea = $(this.opts.srcNodeRef);

      this.opts.placeholder = this.opts.placeholder || this.textarea.attr('placeholder');

      if (!this.textarea.length) {
        throw new Error('Wordpad: param textarea is required.');
        return;
      }

      editor = this.textarea.data('wordpad');
      if (editor != null) {
        editor.destroy();
      }
      this.id = ++Wordpad.count;
      this._render();


      var self = this;
      this.editable = new Editable(this._elm,{
        classPrefix : "wordpad-",
        textarea : this.textarea,
        body : this.body
      });

      // TODO
      this.editable.on("all",function(e,data){
        return self.trigger(e.type,data);
      });

      if (this.opts.upload && uploader) {
        uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
        this.uploader = uploader(uploadOpts);
      }

      this.toolbar = new Toolbar(this,{
        toolbar: this.opts.toolbar,
        toolbarFloat:  this.opts.toolbarFloat,
        toolbarHidden:  this.opts.toolbarHidden,
        toolbarFloatOffset:  this.opts.toolbarFloatOffset

      });

      if (this.opts.placeholder) {
        this.on('valuechanged', function() {
          return self._placeholder();
        });
      }
      this.setValue(this.textarea.val().trim() || '');
      if (this.textarea.attr('autofocus')) {
        return self.focus();
      }


    }
  });

  Wordpad.prototype.triggerHandler =  Wordpad.prototype.trigger = function(type,data) {
    var args, ref;
    args = [type];
    if (data) {
      args = args.concat(data);
    }
    langx.Evented.prototype.trigger.apply(this, args);
    return this;
  };


  //Wordpad.connect(Util);

  //Wordpad.connect(InputManager);

  //Wordpad.connect(Selection);

  //Wordpad.connect(UndoManager);

  //Wordpad.connect(Keystroke);

  //Wordpad.connect(Formatter);

  //Wordpad.connect(Toolbar);

  //Wordpad.connect(Indentation);

  //Wordpad.connect(Clipboard);

  Wordpad.count = 0;


  Wordpad.prototype._render = function() {
    var key, ref, results, val;

    //this.el = $(this._tpl).insertBefore(this.textarea);
    this.el = $(this._elm).insertBefore (this.textarea);

    this.wrapper = this.el.find('.wordpad-wrapper');
    this.body = this.wrapper.find('.wordpad-body');
    this.placeholderEl = this.wrapper.find('.wordpad-placeholder').append(this.opts.placeholder);
    this.el.data('wordpad', this);
    this.wrapper.append(this.textarea);
    this.textarea.data('wordpad', this).blur();
    this.body.attr('tabindex', this.textarea.attr('tabindex'));

    if (this.opts.params) {
      ref = this.opts.params;
      results = [];
      for (key in ref) {
        val = ref[key];
        results.push($('<input/>', {
          type: 'hidden',
          name: key,
          value: val
        }).insertAfter(this.textarea));
      }
      return results;
    }
  };

  Wordpad.prototype._placeholder = function() {
    var children;
    children = this.body.children();
    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.opts.indentWidth)) {
      return this.placeholderEl.show();
    } else {
      return this.placeholderEl.hide();
    }
  };

  Wordpad.prototype.setValue = function(val) {
    this.hidePopover();

    this.editable.setValue(val);

    return this.trigger('valuechanged');
  };

  Wordpad.prototype.getValue = function() {
    return this.editable.getValue();
  };

  Wordpad.prototype.focus = function() {
    return this.editable.focus();
  };

  Wordpad.prototype.blur = function() {
    return this.editable.blur();
  };

  Wordpad.prototype.findAction = function(name) {
    if (!this._actions[name]) {
      if (!this.constructor.addons.actions[name]) {
        throw new Error("Wordpad: invalid action " + name);
      }

      this._actions[name] = new this.constructor.addons.actions[name]({
        editor: this
      });

    }

    return this._actions[name];
  };

  Wordpad.prototype.hidePopover = function() {
    return this.el.find('.wordpad-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
  };

  Wordpad.prototype.destroy = function() {
    this.trigger('destroy');
    this.textarea.closest('form').off('.Wordpad .wordpad-' + this.id);
    this.selection.clear();
    this.inputManager.focused = false;
    this.textarea.insertBefore(this.el).hide().val('').removeData('wordpad');
    this.el.remove();
    $(document).off('.wordpad-' + this.id);
    $(window).off('.wordpad-' + this.id);
    return this.off();
  };


  Wordpad.Toolbar = Toolbar;

  Wordpad.i18n = i18n;

  Wordpad.addons = addons;


  return skylark.attach("widgets.Wordpad",Wordpad);

});
