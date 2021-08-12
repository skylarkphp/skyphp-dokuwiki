define([
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-contents/Editable",
  "skylark-widgets-base/Widget",
  "skylark-widgets-toolbars/Toolbar",
  "./uploader",
  "./i18n",
  "./addons"

],function(skylark,langx, $, Editable,Widget,Toolbar,uploader,i18n,addons){ 

  var Wordpad = Widget.inherit({
      klassName : "Wordpad",
      pluginName : "lark.wordpad",

      options : {
        classes : {
          icons : {
            html : "fa fa-html5",
            
            header: "fa fa-header",

            bold : "fa fa-bold",
            italic : "fa fa-italic",
            underline: "fa fa-underline",
            strikethrough : "fa fa-strikethrough",
            fontScale: "fa fa-text-height",
            fontColor: "fa fa-font",
            mark : "fa fa-pencil",

            blockquote: "fa fa-quote-right",
            listul : "fa fa-list-ul",
            listol : "fa fa-list-ol",
            code: "fa fa-code",
            table : "fa fa-table",

            fullscreen : "fa fa-expand",

            emoji: "fa fa-smile-o",
            link : "fa fa-link",
            image: "fa fa-picture-o",
            video: "fa fa-video-camera",
            hr: "fa fa-minus",

            indent: "fa fa-indent",
            outdent: "fa fa-dedent",
            alignLeft: "fa fa-align-left",
            alignCenter: "fa fa-align-center",
            alignRight: "fa fa-align-right",
            alignJustify: "fa fa-align-justify",

          }
        },
        srcNodeRef: null,
        placeholder: '',
        addons : {
          actions : {
            image : {
               placeholderImage: 'images/image.png',
            },
            video : {
              placeholderPoster: "images/poster.jpg"
            }
          },
          toolbar : {
            items : {
              emoji : {

              }
            }
          }
        },
       
        params: {},
        upload: false,
        template : "<div class=\"lark-wordpad\">\n  <div class=\"wordpad-wrapper\">\n    <div class=\"wordpad-placeholder\"></div>\n    <div class=\"wordpad-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>"
      },


    _init : function() {
      this._actions = [];

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;

      var e, editor, uploadOpts;
      this.textarea = $(this.options.srcNodeRef);

      this.options.placeholder = this.options.placeholder || this.textarea.attr('placeholder');

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
        classPrefix : "lark-wordpad-",
        textarea : this.textarea,
        body : this.body
      });

      // TODO
      this.editable.on("all",function(e,data){
        return self.trigger(e.type,data);
      });

      if (this.options.upload && uploader) {
        uploadOpts = typeof this.options.upload === 'object' ? this.options.upload : {};
        this.uploader = uploader(uploadOpts);
      }


      var actions = [];

      var  ref = this.options.toolbar;
      for (var k = 0, len = ref.length; k < len; k++) {
        var name = ref[k];
        if (name === '|') {
          actions.push({
            name : "|"
          });
          continue;
        }

        var action  = this.findAction(name),
            toolItemCtor = addons.toolbar.items[name];


        //if (!toolItemCtor) {
        //  toolItemCtor = ToolButton;
        //}
        action.toolItemCtor = toolItemCtor;
        actions.push(action);
      };

      this.toolbar = new Toolbar({
        actions : actions,
        classes : {
          icons : this.options.classes.icons
        }
        //toolbar: this.options.toolbar,
        //toolbarFloat:  this.options.toolbarFloat,
        //toolbarHidden:  this.options.toolbarHidden,
        //toolbarFloatOffset:  this.options.toolbarFloatOffset

      });

      this.toolbar.mount(this._elm,"prepend");

      
      if (this.options.placeholder) {
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
    this.placeholderEl = this.wrapper.find('.wordpad-placeholder').append(this.options.placeholder);
    this.el.data('wordpad', this);
    this.wrapper.append(this.textarea);
    this.textarea.data('wordpad', this).blur();
    this.body.attr('tabindex', this.textarea.attr('tabindex'));

    if (this.options.params) {
      ref = this.options.params;
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
    if (children.length === 0 || (children.length === 1 && this.editable.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.options.indentWidth)) {
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

  Wordpad.prototype.sync = function() {
    this.editable.sync();
    return this;
  };

  Wordpad.prototype.focus = function() {
    this.editable.focus();
    return this;
  };

  Wordpad.prototype.blur = function() {
    this.editable.blur();
    return this;
  };

  Wordpad.prototype.findAction = function(name) {
    var action = this._actions[name];
    if (!action) {
      if (!this.constructor.addons.actions[name]) {
        throw new Error("Wordpad: invalid action " + name);
      }

      action = this._actions[name] = new this.constructor.addons.actions[name]({
        editor: this
      });

      this._actions.push(action);
    }

    return action;
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
