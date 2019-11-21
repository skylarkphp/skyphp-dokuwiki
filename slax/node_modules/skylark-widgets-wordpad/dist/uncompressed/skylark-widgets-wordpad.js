/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-wordpad/i18n',[

],function(){ 

    var i18n =  {
      'zh-CN': {
        'blockquote': '引用',
        'bold': '加粗文字',
        'code': '插入代码',
        'color': '文字颜色',
        'coloredText': '彩色文字',
        'hr': '分隔线',
        'image': '插入图片',
        'externalImage': '外链图片',
        'uploadImage': '上传图片',
        'uploadFailed': '上传失败了',
        'uploadError': '上传出错了',
        'imageUrl': '图片地址',
        'imageSize': '图片尺寸',
        'imageAlt': '图片描述',
        'restoreImageSize': '还原图片尺寸',
        'uploading': '正在上传',
        'indent': '向右缩进',
        'outdent': '向左缩进',
        'italic': '斜体文字',
        'link': '插入链接',
        'linkText': '链接文字',
        'linkUrl': '链接地址',
        'linkTarget': '打开方式',
        'openLinkInCurrentWindow': '在当前窗口中打开',
        'openLinkInNewWindow': '在新窗口中打开',
        'removeLink': '移除链接',
        'ol': '有序列表',
        'ul': '无序列表',
        'strikethrough': '删除线文字',
        'table': '表格',
        'deleteRow': '删除行',
        'insertRowAbove': '在上面插入行',
        'insertRowBelow': '在下面插入行',
        'deleteColumn': '删除列',
        'insertColumnLeft': '在左边插入列',
        'insertColumnRight': '在右边插入列',
        'deleteTable': '删除表格',
        'title': '标题',
        'normalText': '普通文本',
        'underline': '下划线文字',
        'alignment': '水平对齐',
        'alignCenter': '居中',
        'alignLeft': '居左',
        'alignRight': '居右',
        'selectLanguage': '选择程序语言',
        'fontScale': '字体大小',
        'fontScaleXLarge': '超大字体',
        'fontScaleLarge': '大号字体',
        'fontScaleNormal': '正常大小',
        'fontScaleSmall': '小号字体',
        'fontScaleXSmall': '超小字体'
      },
      'en-US': {
        'blockquote': 'Block Quote',
        'bold': 'Bold',
        'code': 'Code',
        'color': 'Text Color',
        'coloredText': 'Colored Text',
        'hr': 'Horizontal Line',
        'image': 'Insert Image',
        'externalImage': 'External Image',
        'uploadImage': 'Upload Image',
        'uploadFailed': 'Upload failed',
        'uploadError': 'Error occurs during upload',
        'imageUrl': 'Url',
        'imageSize': 'Size',
        'imageAlt': 'Alt',
        'restoreImageSize': 'Restore Origin Size',
        'uploading': 'Uploading',
        'indent': 'Indent',
        'outdent': 'Outdent',
        'italic': 'Italic',
        'link': 'Insert Link',
        'linkText': 'Text',
        'linkUrl': 'Url',
        'linkTarget': 'Target',
        'openLinkInCurrentWindow': 'Open link in current window',
        'openLinkInNewWindow': 'Open link in new window',
        'removeLink': 'Remove Link',
        'ol': 'Ordered List',
        'ul': 'Unordered List',
        'strikethrough': 'Strikethrough',
        'table': 'Table',
        'deleteRow': 'Delete Row',
        'insertRowAbove': 'Insert Row Above',
        'insertRowBelow': 'Insert Row Below',
        'deleteColumn': 'Delete Column',
        'insertColumnLeft': 'Insert Column Left',
        'insertColumnRight': 'Insert Column Right',
        'deleteTable': 'Delete Table',
        'title': 'Title',
        'normalText': 'Text',
        'underline': 'Underline',
        'alignment': 'Alignment',
        'alignCenter': 'Align Center',
        'alignLeft': 'Align Left',
        'alignRight': 'Align Right',
        'selectLanguage': 'Select Language',
        'fontScale': 'Font Size',
        'fontScaleXLarge': 'X Large Size',
        'fontScaleLarge': 'Large Size',
        'fontScaleNormal': 'Normal Size',
        'fontScaleSmall': 'Small Size',
        'fontScaleXSmall': 'X Small Size'
      },

      translate : function() {
        var args, key, ref, result;
        key = arguments[0], args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];
        result = ((ref = i18n[this.locale]) != null ? ref[key] : void 0) || '';
        if (!(args.length > 0)) {
          return result;
        }
        result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
          if (position) {
            return p + args[parseInt(position) - 1];
          } else {
            return p + args.shift();
          }
        });
        return result.replace(/%%s/g, '%s');
      }

    };

    return i18n;
});
define('skylark-widgets-wordpad/ToolButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-base/Widget",
  "./i18n"
],function(langx, $, Widget, i18n){ 
  var slice = [].slice;

  var ToolButton = Widget.inherit( {

    options : {
      template: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',

      menu : {
        menuWrapper: '<div class="toolbar-menu"></div>',
        menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
        separator: '<li><span class="separator"></span></li>'      
      }

    },

    _construct : function(opts) {
      this.action = opts.action;
      this.toolbar = opts.toolbar;
      this.editor = opts.toolbar.editor;
      Widget.prototype._construct.call(this,opts);
    },

    _init : function() {
      var k, len, ref, tag;
      this.render();
      var _this = this;
      this.el.on('mousedown', function(e) {
          var exceed, noFocus, param;
          e.preventDefault();
          noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (_this.el.hasClass('disabled')) {
            return false;
          }
          if (noFocus) {
            _this.editor.focus();
          }
          if (_this.menu) {
            _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
            if (_this.wrapper.is('.menu-on')) {
              exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
              if (exceed > 0) {
                _this.menuWrapper.css({
                  'left': 'auto',
                  'right': 0
                });
              }
              _this.trigger('menuexpand');
            }
            return false;
          }
          param = _this.el.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('click', 'a.menu-item', function(e) {
          var btn, noFocus, param;
          e.preventDefault();
          btn = $(e.currentTarget);
          _this.wrapper.removeClass('menu-on');
          noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (btn.hasClass('disabled') || noFocus) {
            return false;
          }
          _this.toolbar.wrapper.removeClass('menu-on');
          param = btn.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('mousedown', 'a.menu-item', function(e) {
        return false;
      });

      this.action.state.on("changed", function(e,args) {
        var updates = args.data;
        if (updates["active"] !== undefined) {
          _this._doActive(updates["active"].value);
        }

        if (updates["disabled"] !== undefined) {
          _this._doDisabled(updates["disabled"].value);
        }

      });
    },

    _doActive : function(value) {
      return this.el.toggleClass('active', this.active);
    },

    _doDisabled : function(value) {
      return this.el.toggleClass('disabled', this.disabled);
    },

    iconClassOf : function(icon) {
      if (icon) {
        return "wordpad-icon wordpad-icon-" + icon;
      } else {
        return '';
      }
    },

    setIcon : function(icon) {
      return this.el.find('span').removeClass().addClass(this.iconClassOf(icon)).text(this.text);
    },

    render : function() {

      //this.wrapper = $(this._tpl.item).appendTo(this.toolbar.list);
      this.toolbar.addToolItem(this);
      this.wrapper = $(this._elm);

      this.el = this.wrapper.find('a.toolbar-item');
      this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
      this.setIcon(this.icon);
      if (!this.menu) {
        return;
      }
      this.menuWrapper = $(this.options.menu.menuWrapper).appendTo(this.wrapper);
      this.menuWrapper.addClass("toolbar-menu-" + this.name);
      return this.renderMenu();
    },

    renderMenu : function() {
      var $menuBtnEl, $menuItemEl, k, len, menuItem, ref, ref1, results;
      if (!langx.isArray(this.menu)) {
        return;
      }
      this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
      ref = this.menu;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        menuItem = ref[k];
        if (menuItem === '|') {
          $(this.options.menu.separator).appendTo(this.menuEl);
          continue;
        }
        $menuItemEl = $(this.options.menu.menuItem).appendTo(this.menuEl);
        $menuBtnEl = $menuItemEl.find('a.menu-item').attr({
          'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
          'data-param': menuItem.param
        }).addClass('menu-item-' + menuItem.name);
        if (menuItem.icon) {
          results.push($menuBtnEl.find('span').addClass(this.iconClassOf(menuItem.icon)));
        } else {
          results.push($menuBtnEl.find('span').text(menuItem.text));
        }
      }
      return results;
    },

    command : function(params) {
      this.action.execute(params);
    },

    "name" : {
      get : function() {
        return this.action.name;
      }
    },

    "icon" : {
      get : function() {
        return this.action.icon;
      }
    },

    "title" : {
      get : function() {
        return this.action.tooltip;
      }
    },

    "text" : {
      get : function() {
        return this.action.text;
      }
    },

    "htmlTag" : {
      get : function() {
        return this.action.htmlTag;
      }
    },

    "disableTag" : {
      get : function() {
        return this.action.disableTag;
      }
    },

    "menu" : {
      get : function() {
        return this.action.menu;
      }
    },

    "editable" : {
      get : function() {
        return this._options.editable;
      }
    },

    "active" : {
      get : function() {
        return this.action.active;
      }
    },

    "disabled" : {
      get : function() {
        return this.action.disabled;
      }
    },

    "needFocus" : {
      get : function() {
        return this.action.needFocus;
      }
    },


    "shortcut" : {
      get : function() {
        return this.action.shortcut;
      }
    }


  }); 


  return ToolButton;
});

define('skylark-widgets-wordpad/addons',[],function(){
	return {
	    general : {

	    },

	    actions : {

	    },

	    toolbar : {
	      items : {
	        
	      }
	      
	    }  		
	};
});
define('skylark-widgets-wordpad/Toolbar',[
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
define('skylark-widgets-wordpad/uploader',[
  "skylark-langx/langx",
  "skylark-domx-query"
],function(langx,$){ 

  var Uploader = langx.Evented.inherit({
    init : function() {
      this.files = [];
      this.queue = [];
      this.id = ++Uploader.count;
      this.on('uploadcomplete', (function(_this) {
        return function(e, file) {
          _this.files.splice(langx.inArray(file, _this.files), 1);
          if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
            return _this.upload(_this.queue.shift());
          } else {
            return _this.uploading = false;
          }
        };
      })(this));
      return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
        return function(e) {
          if (!_this.uploading) {
            return;
          }
          e.originalEvent.returnValue = _this._t('leaveConfirm');
          return _this._t('leaveConfirm');  
        };
      })(this));
    }

  });

  Uploader.count = 0;

  Uploader.prototype.opts = {
    url: '',
    params: null,
    fileKey: 'upload_file',
    connectionCount: 3
  };



  Uploader.prototype.generateId = (function() {
    var id;
    id = 0;
    return function() {
      return id += 1;
    };
  })();

  Uploader.prototype.upload = function(file, opts) {
    var f, i, key, len;
    if (opts == null) {
      opts = {};
    }
    if (file == null) {
      return;
    }
    if (langx.isArray(file) || file instanceof FileList) {
      for (i = 0, len = file.length; i < len; i++) {
        f = file[i];
        this.upload(f, opts);
      }
    } else if ($(file).is('input:file')) {
      key = $(file).attr('name');
      if (key) {
        opts.fileKey = key;
      }
      this.upload(langx.makeArray($(file)[0].files), opts);
    } else if (!file.id || !file.obj) {
      file = this.getFile(file);
    }
    if (!(file && file.obj)) {
      return;
    }
    langx.extend(file, opts);
    if (this.files.length >= this.opts.connectionCount) {
      this.queue.push(file);
      return;
    }
    if (this.trigger('beforeupload', [file]) === false) {
      return;
    }
    this.files.push(file);
    this._xhrUpload(file);
    return this.uploading = true;
  };

  Uploader.prototype.getFile = function(fileObj) {
    var name, ref, ref1;
    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
    } else {
      return null;
    }
    return {
      id: this.generateId(),
      url: this.opts.url,
      params: this.opts.params,
      fileKey: this.opts.fileKey,
      name: name,
      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
      ext: name ? name.split('.').pop().toLowerCase() : '',
      obj: fileObj
    };
  };

  Uploader.prototype._xhrUpload = function(file) {
    var formData, k, ref, v;
    formData = new FormData();
    formData.append(file.fileKey, file.obj);
    formData.append("original_filename", file.name);
    if (file.params) {
      ref = file.params;
      for (k in ref) {
        v = ref[k];
        formData.append(k, v);
      }
    }

    //TODO
    return file.xhr = langx.xhr({
      url: file.url,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      headers: {
        'X-File-Name': encodeURIComponent(file.name)
      },
      xhr: function() {
        var req;
        req = $.ajaxSettings.xhr();
        if (req) {
          req.upload.onprogress = (function(_this) {
            return function(e) {
              return _this.progress(e);
            };
          })(this);
        }
        return req;
      },
      progress: (function(_this) {
        return function(e) {
          if (!e.lengthComputable) {
            return;
          }
          return _this.trigger('uploadprogress', [file, e.loaded, e.total]);
        };
      })(this),
      error: (function(_this) {
        return function(xhr, status, err) {
          return _this.trigger('uploaderror', [file, xhr, status]);
        };
      })(this),
      success: (function(_this) {
        return function(result) {
          _this.trigger('uploadprogress', [file, file.size, file.size]);
          _this.trigger('uploadsuccess', [file, result]);
          return $(document).trigger('uploadsuccess', [file, result, _this]);
        };
      })(this),
      complete: (function(_this) {
        return function(xhr, status) {
          return _this.trigger('uploadcomplete', [file, xhr.responseText]);
        };
      })(this)
    });
  };

  Uploader.prototype.cancel = function(file) {
    var f, i, len, ref;
    if (!file.id) {
      ref = this.files;
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        if (f.id === file * 1) {
          file = f;
          break;
        }
      }
    }
    this.trigger('uploadcancel', [file]);
    if (file.xhr) {
      file.xhr.abort();
    }
    return file.xhr = null;
  };

  Uploader.prototype.readImageFile = function(fileObj, callback) {
    var fileReader, img;
    if (!langx.isFunction(callback)) {
      return;
    }
    img = new Image();
    img.onload = function() {
      return callback(img);
    };
    img.onerror = function() {
      return callback();
    };
    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
      fileReader = new FileReader();
      fileReader.onload = function(e) {
        return img.src = e.target.result;
      };
      return fileReader.readAsDataURL(fileObj);
    } else {
      return callback();
    }
  };

  Uploader.prototype.destroy = function() {
    var file, i, len, ref;
    this.queue.length = 0;
    ref = this.files;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      this.cancel(file);
    }
    $(window).off('.uploader-' + this.id);
    return $(document).off('.uploader-' + this.id);
  };

  Uploader.i18n = {
    'zh-CN': {
      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
    }
  };

  Uploader.locale = 'zh-CN';

  return  function(opts) {
    return new Uploader(opts);
  };

});

define('skylark-widgets-wordpad/Wordpad',[
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

define('skylark-widgets-wordpad/Action',[
  "skylark-langx/langx",
  "skylark-widgets-base/Action",
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
      _Action.prototype._construct.apply(this,arguments);
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


  return Action;

});
define('skylark-widgets-wordpad/Popover',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./Wordpad",
  "./i18n"
],function(langx,$,Wordpad,i18n){ 

  var Popover = langx.Evented.inherit({
     init : function(opts) {
      this.action = opts.action;
      this.editor = opts.action.editor;
      this._init();
    }
  });


  Popover.prototype.offset = {
    top: 4,
    left: 0
  };

  Popover.prototype.target = null;

  Popover.prototype.active = false;

  Popover.prototype._init = function() {
    this.el = $('<div class="wordpad-popover"></div>').appendTo(this.editor.el).data('popover', this);
    this.render();
    this.el.on('mouseenter', (function(_this) {
      return function(e) {
        return _this.el.addClass('hover');
      };
    })(this));
    return this.el.on('mouseleave', (function(_this) {
      return function(e) {
        return _this.el.removeClass('hover');
      };
    })(this));
  };

  Popover.prototype.render = function() {};

  Popover.prototype._initLabelWidth = function() {
    var $fields;
    $fields = this.el.find('.settings-field');
    if (!($fields.length > 0)) {
      return;
    }
    this._labelWidth = 0;
    $fields.each((function(_this) {
      return function(i, field) {
        var $field, $label;
        $field = $(field);
        $label = $field.find('label');
        if (!($label.length > 0)) {
          return;
        }
        return _this._labelWidth = Math.max(_this._labelWidth, $label.width());
      };
    })(this));
    return $fields.find('label').width(this._labelWidth);
  };

  Popover.prototype.show = function($target, position) {
    if (position == null) {
      position = 'bottom';
    }
    if ($target == null) {
      return;
    }
    this.el.siblings('.wordpad-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
    if (this.active && this.target) {
      this.target.removeClass('selected');
    }
    this.target = $target.addClass('selected');
    if (this.active) {
      this.refresh(position);
      return this.trigger('popovershow');
    } else {
      this.active = true;
      this.el.css({
        left: -9999
      }).show();
      if (!this._labelWidth) {
        this._initLabelWidth();
      }
      this.editor.editable.util.reflow();
      this.refresh(position);
      return this.trigger('popovershow');
    }
  };

  Popover.prototype.hide = function() {
    if (!this.active) {
      return;
    }
    if (this.target) {
      this.target.removeClass('selected');
    }
    this.target = null;
    this.active = false;
    this.el.hide();
    return this.trigger('popoverhide');
  };

  Popover.prototype.refresh = function(position) {
    var editorOffset, left, maxLeft, targetH, targetOffset, top;
    if (position == null) {
      position = 'bottom';
    }
    if (!this.active) {
      return;
    }
    editorOffset = this.editor.el.offset();
    targetOffset = this.target.offset();
    targetH = this.target.outerHeight();
    if (position === 'bottom') {
      top = targetOffset.top - editorOffset.top + targetH;
    } else if (position === 'top') {
      top = targetOffset.top - editorOffset.top - this.el.height();
    }
    maxLeft = this.editor.wrapper.width() - this.el.outerWidth() - 10;
    left = Math.min(targetOffset.left - editorOffset.left, maxLeft);
    return this.el.css({
      top: top + this.offset.top,
      left: left + this.offset.left
    });
  };

  Popover.prototype.destroy = function() {
    this.target = null;
    this.active = false;
    this.editor.off('.linkpopover');
    return this.el.remove();
  };

  Popover.prototype._t = function(name) {
    var args, ref, result;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    result = i18n.translate.apply(i18n, args);
    return result;
  };

  Wordpad.Popover = Popover;

  return Popover;

	
});
define('skylark-widgets-wordpad/addons/actions/AlignmentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var AlignmentAction = Action.inherit({
    name : "alignment",

    icon : 'align-left',
    
    htmlTag : 'p, h1, h2, h3, h4, td, th',

    _init : function() {
     Action.prototype._init.call(this);
     this.menu = [
          {
            name: 'left',
            text: i18n.translate('alignLeft'),
            icon: 'align-left',
            param: 'left'
          }, {
            name: 'center',
            text: i18n.translate('alignCenter'),
            icon: 'align-center',
            param: 'center'
          }, {
            name: 'right',
            text: i18n.translate('alignRight'),
            icon: 'align-right',
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
define('skylark-widgets-wordpad/addons/actions/BlockquoteAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'quote-left',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
      }
   });


   addons.actions.blockquote = BlockquoteAction; 

   return BlockquoteAction;
});
define('skylark-widgets-wordpad/addons/actions/BoldAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
    var BoldAction = Action.inherit({
      name : 'bold',

      icon : 'bold',

      htmlTag : 'b, strong',

      disableTag : 'pre',

      shortcut : 'cmd+b',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + b )';
        } else {
          this.title = this.title + ' ( Ctrl + b )';
          this.shortcut = 'ctrl+b';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('bold');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.bold();
      }

    });


    addons.actions.bold = BoldAction; 

    return BoldAction;
});
define('skylark-widgets-wordpad/addons/actions/CodePopover',[
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  
   var CodePopover = Popover.inherit({
     render : function() {
      var $option, k, lang, len, ref;
      this._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">" + (this._t('selectLanguage')) + "</option>\n    </select>\n  </div>\n</div>";
      this.langs = this.editor.opts.codeLanguages || [
        {
          name: 'Bash',
          value: 'bash'
        }, {
          name: 'C++',
          value: 'c++'
        }, {
          name: 'C#',
          value: 'cs'
        }, {
          name: 'CSS',
          value: 'css'
        }, {
          name: 'Erlang',
          value: 'erlang'
        }, {
          name: 'Less',
          value: 'less'
        }, {
          name: 'Sass',
          value: 'sass'
        }, {
          name: 'Diff',
          value: 'diff'
        }, {
          name: 'CoffeeScript',
          value: 'coffeescript'
        }, {
          name: 'HTML,XML',
          value: 'html'
        }, {
          name: 'JSON',
          value: 'json'
        }, {
          name: 'Java',
          value: 'java'
        }, {
          name: 'JavaScript',
          value: 'js'
        }, {
          name: 'Markdown',
          value: 'markdown'
        }, {
          name: 'Objective C',
          value: 'oc'
        }, {
          name: 'PHP',
          value: 'php'
        }, {
          name: 'Perl',
          value: 'parl'
        }, {
          name: 'Python',
          value: 'python'
        }, {
          name: 'Ruby',
          value: 'ruby'
        }, {
          name: 'SQL',
          value: 'sql'
        }
      ];
      this.el.addClass('code-popover').append(this._tpl);
      this.selectEl = this.el.find('.select-lang');
      ref = this.langs;
      for (k = 0, len = ref.length; k < len; k++) {
        lang = ref[k];
        $option = $('<option/>', {
          text: lang.name,
          value: lang.value
        }).appendTo(this.selectEl);
      }
      this.selectEl.on('change', (function(_this) {
        return function(e) {
          var selected;
          _this.lang = _this.selectEl.val();
          selected = _this.target.hasClass('selected');
          _this.target.removeClass().removeAttr('data-lang');
          if (_this.lang !== -1) {
            _this.target.attr('data-lang', _this.lang);
          }
          if (selected) {
            _this.target.addClass('selected');
          }
          return _this.editor.trigger('valuechanged');
        };
      })(this));
      return this.editor.on('valuechanged', (function(_this) {
        return function(e) {
          if (_this.active) {
            return _this.refresh();
          }
        };
      })(this));
    },

    show : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      this.lang = this.target.attr('data-lang');
      if (this.lang != null) {
        return this.selectEl.val(this.lang);
      } else {
        return this.selectEl.val(-1);
      }
    }
   });

  return CodePopover;
});
define('skylark-widgets-wordpad/addons/actions/CodeAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./CodePopover"
],function($,addons,Action,CodePopover){ 
  

   var CodeAction = Action.inherit({
      name : 'code',

      icon : 'code',

      htmlTag : 'pre',

      disableTag : 'ul, ol, table',

      _init : function() {
        Action.prototype._init.call(this);
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.decorate($(pre));
            });
          };
        })(this));
        return this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.undecorate($(pre));
            });
          };
        })(this));
      },

      _checkMode : function() {
        var $blockNodes, range;
        range = this.editor.editable.selection.range();
        if (($blockNodes = $(range.cloneContents()).find(this.editor.editable.util.blockNodes.join(','))) > 0 || (range.collapsed && this.editor.editable.selection.startNodes().filter('code').length === 0)) {
          this.inlineMode = false;
          return this.htmlTag = 'pre';
        } else {
          this.inlineMode = true;
          return this.htmlTag = 'code';
        }
      },

      _status : function() {
        this._checkMode();
        Action.prototype._status.call(this);
        if (this.inlineMode) {
          return;
        }
        if (this.active) {
          if (!this.popover) {
            this.popover = new CodePopover({
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

      decorate : function($pre) {
        var $code, lang, ref, ref1;
        $code = $pre.find('> code');
        if ($code.length > 0) {
          lang = (ref = $code.attr('class')) != null ? (ref1 = ref.match(/lang-(\S+)/)) != null ? ref1[1] : void 0 : void 0;
          $code.contents().unwrap();
          if (lang) {
            return $pre.attr('data-lang', lang);
          }
        }
      },

      undecorate : function($pre) {
        var $code, lang;
        lang = $pre.attr('data-lang');
        $code = $('<code/>');
        if (lang && lang !== -1) {
          $code.addClass('lang-' + lang);
        }
        return $pre.wrapInner($code).removeAttr('data-lang');
      },

      _execute : function() {
        if (this.inlineMode) {
          return this._inlineCommand();
        } else {
          return this._blockCommand();
        }
      },

      _blockCommand : function() {
        return this.editor.editable.blockCode(this.htmlTag,this.disableTag);
      },

      _inlineCommand : function() {
        return this.editor.editable.inlineCode(this.active);
      }
   });


   addons.actions.code = CodeAction; 

   return CodeAction;

});
define('skylark-widgets-wordpad/addons/actions/ColorAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  

   var ColorAction = Action.inherit({
    name : 'color',

    icon : 'tint',

    disableTag : 'pre',

    menu : true

   });

   addons.actions.color = ColorAction; 


   return ColorAction;
	
});
define('skylark-widgets-wordpad/addons/actions/EmojiAction',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(langx,$,addons,Action){ 
  var EmojiAction = Action.inherit({
    name : 'emoji',

    icon : 'smile-o',

    menu : true,

    _init : function() {
      Action.prototype._init.apply(this);
      langx.merge(this.editor.editable.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
    }

  });


  addons.actions.emoji = EmojiAction; 

  return EmojiAction;
	
});
define('skylark-widgets-wordpad/addons/actions/FontScaleAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  
  var FontScaleAction = Action.inherit({
    name : 'fontScale',

    icon : 'font',

    htmlTag : 'span',

    disableTag : 'pre, h1, h2, h3, h4, h5',


    _init : function() {
      this.menu = [
        {
          name: '150%',
          text: i18n.translate('fontScaleXLarge'),
          param: '5'
        }, {
          name: '125%',
          text: i18n.translate('fontScaleLarge'),
          param: '4'
        }, {
          name: '100%',
          text: i18n.translate('fontScaleNormal'),
          param: '3'
        }, {
          name: '75%',
          text: i18n.translate('fontScaleSmall'),
          param: '2'
        }, {
          name: '50%',
          text: i18n.translate('fontScaleXSmall'),
          param: '1'
        }
      ];
      return Action.prototype._init.call(this);
    },

    _activeStatus : function() {
      var active, endNode, endNodes, range, startNode, startNodes;
      range = this.editor.editable.selection.range();
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      startNode = startNodes.filter('span[style*="font-size"]');
      endNode = endNodes.filter('span[style*="font-size"]');
      active = startNodes.length > 0 && endNodes.length > 0 && startNode.is(endNode);
      this.setActive(active);
      return this.active;
    },

    _execute : function(param) {
      return this.editor.editable.fontScale(param);
    }
  });


  addons.actions.fontScale = FontScaleAction; 

  return FontScaleAction;
});
define('skylark-widgets-wordpad/addons/actions/FullScreenAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 

  
  var FullScrennAction = Action.inherit({
    name : 'fullscreen',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);

      this.window = $(window);
      this.body = $('body');
      this.editable = this.editor.body;
    },

    iconClassOf : function() {
      return 'icon-fullscreen';
    },


    status : function() {
      return this.setActive(this.body.hasClass(this.constructor.cls));
    },

    _execute : function() {
      var editablePadding, isFullscreen;
      this.body.toggleClass(this.constructor.cls);
      isFullscreen = this.body.hasClass(this.constructor.cls);
      if (isFullscreen) {
        editablePadding = this.editable.outerHeight() - this.editable.height();
        this.window.on("resize.wordpad-fullscreen-" + this.editor.id, (function(_this) {
          return function() {
            return _this._resize({
              height: _this.window.height() - _this.editor.toolbar.outerHeight() - editablePadding
            });
          };
        })(this)).resize();
      } else {
        this.window.off("resize.wordpad-fullscreen-" + this.editor.id).resize();
        this._resize({
          height: 'auto'
        });
      }
      return this.setActive(isFullscreen);
    },

    _resize : function(size) {
      return this.editable.height(size.height);
    }
  });

  FullScrennAction.cls = 'wordpad-fullscreen';

  FullScrennAction.i18n = {
    'zh-CN': {
      fullscreen: '全屏'
    }
  };


  addons.actions.fullscreen = FullScrennAction; 

  return FullScrennAction;

 }); 
define('skylark-widgets-wordpad/addons/actions/HrAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var HrAction = Action.inherit({

	  name : 'hr',

	  icon : 'minus',

	  htmlTag : 'hr',

	  _status : function() {},

	  _execute : function() {
	    return this.editor.editable.hr();
	  }

   });


  addons.actions.hr = HrAction; 

  return HrAction;	
});
define('skylark-widgets-wordpad/addons/actions/HtmlAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var  hasProp = {}.hasOwnProperty,
        slice = [].slice;
  

   var HtmlAction = Action.inherit({
    name : 'html',

    icon : 'html5',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);
      this.editor.textarea.on('focus', (function(_this) {
        return function(e) {
          return _this.editor.el.addClass('focus').removeClass('error');
        };
      })(this));
      this.editor.textarea.on('blur', (function(_this) {
        return function(e) {
          _this.editor.el.removeClass('focus');
          return _this.editor.setValue(_this.editor.textarea.val());
        };
      })(this));
      return this.editor.textarea.on('input', (function(_this) {
        return function(e) {
          return _this._resizeTextarea();
        };
      })(this));
    },

    status : function() {},

    _execute : function() {
      var action, i, len, ref;
      this.editor.blur();
      this.editor.el.toggleClass('wordpad-html');
      this.editor.htmlMode = this.editor.el.hasClass('wordpad-html');
      if (this.editor.htmlMode) {
        this.editor.hidePopover();
        this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val()));
        this._resizeTextarea();
      } else {
        this.editor.setValue(this.editor.textarea.val());
      }
      ref = this.editor._actions;
      for (i = 0, len = ref.length; i < len; i++) {
        action = ref[i];
        if (action.name === 'html') {
          action.setActive(this.editor.htmlMode);
        } else {
          action.setDisabled(this.editor.htmlMode);
        }
      }
      return null;
    },

    beautifyHTML : function() {
      return arguments[0];
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (beautify.html) {
        return beautify.html.apply(beautify, args);
      } else {
        return beautify.apply(null, args);
      }
    },

    _resizeTextarea : function() {
      this._textareaPadding || (this._textareaPadding = this.editor.textarea.innerHeight() - this.editor.textarea.height());
      return this.editor.textarea.height(this.editor.textarea[0].scrollHeight - this._textareaPadding);
    }

   });


   addons.actions.html = HtmlAction; 

   return HtmlAction;
});
define('skylark-widgets-wordpad/addons/actions/ImagePopover',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function(langx, $,addons,Popover){ 
   var ImagePopover = Popover.inherit({

   });

  ImagePopover.prototype.offset = {
    top: 6,
    left: -4
  };

  ImagePopover.prototype.render = function() {
    var tpl;
    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\"\n      title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\"\n      title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-undo\"></span>\n    </a>\n  </div>\n</div>";
    this.el.addClass('image-popover').append(tpl);
    this.srcEl = this.el.find('.image-src');
    this.widthEl = this.el.find('#image-width');
    this.heightEl = this.el.find('#image-height');
    this.altEl = this.el.find('#image-alt');
    this.srcEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (!(e.which === 13 && !_this.target.hasClass('uploading'))) {
          return;
        }
        e.preventDefault();
        range = document.createRange();
        _this.Action.editor.editable.selection.setRangeAfter(_this.target, range);
        return _this.hide();
      };
    })(this));
    this.srcEl.on('blur', (function(_this) {
      return function(e) {
        return _this._loadImage(_this.srcEl.val());
      };
    })(this));
    this.el.find('.image-size').on('blur', (function(_this) {
      return function(e) {
        _this._resizeImg($(e.currentTarget));
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.el.find('.image-size').on('keyup', (function(_this) {
      return function(e) {
        var inputEl;
        inputEl = $(e.currentTarget);
        if (!(e.which === 13 || e.which === 27 || e.which === 9)) {
          return _this._resizeImg(inputEl, true);
        }
      };
    })(this));
    this.el.find('.image-size').on('keydown', (function(_this) {
      return function(e) {
        var $img, inputEl, range;
        inputEl = $(e.currentTarget);
        if (e.which === 13 || e.which === 27) {
          e.preventDefault();
          if (e.which === 13) {
            _this._resizeImg(inputEl);
          } else {
            _this._restoreImg();
          }
          $img = _this.target;
          _this.hide();
          range = document.createRange();
          return _this.Action.editor.editable.selection.setRangeAfter($img, range);
        } else if (e.which === 9) {
          return _this.el.data('popover').refresh();
        }
      };
    })(this));
    this.altEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (e.which === 13) {
          e.preventDefault();
          range = document.createRange();
          _this.Action.editor.editable.selection.setRangeAfter(_this.target, range);
          return _this.hide();
        }
      };
    })(this));
    this.altEl.on('keyup', (function(_this) {
      return function(e) {
        if (e.which === 13 || e.which === 27 || e.which === 9) {
          return;
        }
        _this.alt = _this.altEl.val();
        return _this.target.attr('alt', _this.alt);
      };
    })(this));
    this.el.find('.btn-restore').on('click', (function(_this) {
      return function(e) {
        _this._restoreImg();
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.editor.on('valuechanged', (function(_this) {
      return function(e) {
        if (_this.active) {
          return _this.refresh();
        }
      };
    })(this));
    return this._initUploader();
  };

  ImagePopover.prototype._initUploader = function() {
    var $uploadBtn, createInput;
    $uploadBtn = this.el.find('.btn-upload');
    if (this.editor.uploader == null) {
      $uploadBtn.remove();
      return;
    }
    createInput = (function(_this) {
      return function() {
        if (_this.input) {
          _this.input.remove();
        }
        return _this.input = $('<input/>', {
          type: 'file',
          title: _this._t('uploadImage'),
          multiple: true,
          accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
        }).appendTo($uploadBtn);
      };
    })(this);
    createInput();
    this.el.on('click mousedown', 'input[type=file]', function(e) {
      return e.stopPropagation();
    });
    return this.el.on('change', 'input[type=file]', (function(_this) {
      return function(e) {
        _this.editor.uploader.upload(_this.input, {
          inline: true,
          img: _this.target
        });
        return createInput();
      };
    })(this));
  };

  ImagePopover.prototype._resizeImg = function(inputEl, onlySetVal) {
    var height, value, width;
    if (onlySetVal == null) {
      onlySetVal = false;
    }
    value = inputEl.val() * 1;
    if (!(this.target && (langx.isNumber(value) || value < 0))) {
      return;
    }
    if (inputEl.is(this.widthEl)) {
      width = value;
      height = this.height * value / this.width;
      this.heightEl.val(height);
    } else {
      height = value;
      width = this.width * value / this.height;
      this.widthEl.val(width);
    }
    if (!onlySetVal) {
      this.target.attr({
        width: width,
        height: height
      });
      return this.editor.trigger('valuechanged');
    }
  };

  ImagePopover.prototype._restoreImg = function() {
    var ref, size;
    size = ((ref = this.target.data('image-size')) != null ? ref.split(",") : void 0) || [this.width, this.height];
    this.target.attr({
      width: size[0] * 1,
      height: size[1] * 1
    });
    this.widthEl.val(size[0]);
    this.heightEl.val(size[1]);
    return this.editor.trigger('valuechanged');
  };

  ImagePopover.prototype._loadImage = function(src, callback) {
    if (/^data:image/.test(src) && !this.editor.uploader) {
      if (callback) {
        callback(false);
      }
      return;
    }
    if (this.target.attr('src') === src) {
      return;
    }
    return this.Action.loadImage(this.target, src, (function(_this) {
      return function(img) {
        var blob;
        if (!img) {
          return;
        }
        if (_this.active) {
          _this.width = img.width;
          _this.height = img.height;
          _this.widthEl.val(_this.width);
          _this.heightEl.val(_this.height);
        }
        if (/^data:image/.test(src)) {
          blob = _this.editor.editable.util.dataURLtoBlob(src);
          blob.name = "Base64 Image.png";
          _this.editor.uploader.upload(blob, {
            inline: true,
            img: _this.target
          });
        } else {
          _this.editor.trigger('valuechanged');
        }
        if (callback) {
          return callback(img);
        }
      };
    })(this));
  };

  ImagePopover.prototype.show = function() {
    var $img, args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Popover.prototype.show.apply(this, args);
    $img = this.target;
    this.width = $img.width();
    this.height = $img.height();
    this.alt = $img.attr('alt');
    if ($img.hasClass('uploading')) {
      return this.srcEl.val(this._t('uploading')).prop('disabled', true);
    } else {
      this.srcEl.val($img.attr('src')).prop('disabled', false);
      this.widthEl.val(this.width);
      this.heightEl.val(this.height);
      return this.altEl.val(this.alt);
    }
  };

  return ImagePopover;

});
define('skylark-widgets-wordpad/addons/actions/ImageAction',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./ImagePopover",
  "../../i18n"
],function(langx, $,addons,Action,ImagePopover,i18n){ 
   var ImageAction = Action.inherit({
      name : 'image',

      icon : 'picture-o',

      htmlTag : 'img',

      disableTag : 'pre, table',

      defaultImage : '',

      needFocus : false,

      _init : function() {
        var item, k, len, ref;
        if (this.editor.opts.imageAction) {
          if (Array.isArray(this.editor.opts.imageAction)) {
            this.menu = [];
            ref = this.editor.opts.imageAction;
            for (k = 0, len = ref.length; k < len; k++) {
              item = ref[k];
              this.menu.push({
                name: item + '-image',
                text: this._t(item + 'Image')
              });
            }
          } else {
            this.menu = false;
          }
        } else {
          if (this.editor.uploader != null) {
            this.menu = [
              {
                name: 'upload-image',
                text: i18n.translate('uploadImage')
              }, {
                name: 'external-image',
                text: i18n.translate('externalImage')
              }
            ];
          } else {
            this.menu = false;
          }
        }
        this.defaultImage = this.editor.opts.defaultImage;
        this.editor.body.on('click', 'img:not([data-non-image])', (function(_this) {
          return function(e) {
            var $img, range;
            $img = $(e.currentTarget);
            range = document.createRange();
            range.selectNode($img[0]);
            _this.editor.editable.selection.range(range);
            if (!_this.editor.editable.util.support.onselectionchange) {
              _this.editor.trigger('selectionchanged');
            }
            return false;
          };
        })(this));
        this.editor.body.on('mouseup', 'img:not([data-non-image])', function(e) {
          return false;
        });
        this.editor.on('selectionchanged.image', (function(_this) {
          return function() {
            var $contents, $img, range;
            range = _this.editor.editable.selection.range();
            if (range == null) {
              return;
            }
            $contents = $(range.cloneContents()).contents();
            if ($contents.length === 1 && $contents.is('img:not([data-non-image])')) {
              $img = $(range.startContainer).contents().eq(range.startOffset);
              if (!_this.popover) {
                _this.popover = new ImagePopover({
                  action: _this
                });                
              }

              return _this.popover.show($img);
            } else {
              if (_this.popover) {
                  return _this.popover.hide();
              }
            }
          };
        })(this));
        this.editor.on('valuechanged.image', (function(_this) {
          return function() {
            var $masks;
            $masks = _this.editor.wrapper.find('.wordpad-image-loading');
            if (!($masks.length > 0)) {
              return;
            }
            return $masks.each(function(i, mask) {
              var $img, $mask, file;
              $mask = $(mask);
              $img = $mask.data('img');
              if (!($img && $img.parent().length > 0)) {
                $mask.remove();
                if ($img) {
                  file = $img.data('file');
                  if (file) {
                    _this.editor.uploader.cancel(file);
                    if (_this.editor.body.find('img.uploading').length < 1) {
                      return _this.editor.uploader.trigger('uploadready', [file]);
                    }
                  }
                }
              }
            });
          };
        })(this));
        return Action.prototype._init.call(this);
      },

      render : function() {
        var args;
        args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
        Action.prototype.render.apply(this, args);
        this.popover = new ImagePopover({
          Action: this
        });
        if (this.editor.opts.imageAction === 'upload') {
          return this._initUploader(this.el);
        }
      },

      renderMenu : function() {
        Action.prototype.renderMenu.call(this);
        return this._initUploader();
      },

      _initUploader : function($uploadItem) {
        var $input, createInput, uploadProgress;
        if ($uploadItem == null) {
          $uploadItem = this.menuEl.find('.menu-item-upload-image');
        }
        if (this.editor.uploader == null) {
          this.el.find('.btn-upload').remove();
          return;
        }
        $input = null;
        createInput = (function(_this) {
          return function() {
            if ($input) {
              $input.remove();
            }
            return $input = $('<input/>', {
              type: 'file',
              title: _this._t('uploadImage'),
              multiple: true,
              accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
            }).appendTo($uploadItem);
          };
        })(this);
        createInput();
        $uploadItem.on('click mousedown', 'input[type=file]', function(e) {
          return e.stopPropagation();
        });
        $uploadItem.on('change', 'input[type=file]', (function(_this) {
          return function(e) {
            if (_this.editor.editable.inputManager.focused) {
              _this.editor.uploader.upload($input, {
                inline: true
              });
              createInput();
            } else {
              _this.editor.one('focus', function(e) {
                _this.editor.uploader.upload($input, {
                  inline: true
                });
                return createInput();
              });
              _this.editor.focus();
            }
            return _this.wrapper.removeClass('menu-on');
          };
        })(this));
        this.editor.uploader.on('beforeupload', (function(_this) {
          return function(e, file) {
            var $img;
            if (!file.inline) {
              return;
            }
            if (file.img) {
              $img = $(file.img);
            } else {
              $img = _this.createImage(file.name);
              file.img = $img;
            }
            $img.addClass('uploading');
            $img.data('file', file);
            return _this.editor.uploader.readImageFile(file.obj, function(img) {
              var src;
              if (!$img.hasClass('uploading')) {
                return;
              }
              src = img ? img.src : _this.defaultImage;
              return _this.loadImage($img, src, function() {
                if (_this.popover.active) {
                  _this.popover.refresh();
                  return _this.popover.srcEl.val(_this._t('uploading')).prop('disabled', true);
                }
              });
            });
          };
        })(this));
        uploadProgress = langx.proxy(this.editor.editable.util.throttle(function(e, file, loaded, total) {
          var $img, $mask, percent;
          if (!file.inline) {
            return;
          }
          $mask = file.img.data('mask');
          if (!$mask) {
            return;
          }
          $img = $mask.data('img');
          if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
            $mask.remove();
            return;
          }
          percent = loaded / total;
          percent = (percent * 100).toFixed(0);
          if (percent > 99) {
            percent = 99;
          }
          return $mask.find('.progress').height((100 - percent) + "%");
        }, 500), this);
        this.editor.uploader.on('uploadprogress', uploadProgress);
        this.editor.uploader.on('uploadsuccess', (function(_this) {
          return function(e, file, result) {
            var $img, img_path, msg;
            if (!file.inline) {
              return;
            }
            $img = file.img;
            if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
              return;
            }
            if (typeof result !== 'object') {
              try {
                result = JSON.parse(result);
              } catch (_error) {
                e = _error;
                result = {
                  success: false
                };
              }
            }
            if (result.success === false) {
              msg = result.msg || _this._t('uploadFailed');
              alert(msg);
              img_path = _this.defaultImage;
            } else {
              img_path = result.file_path;
            }
            _this.loadImage($img, img_path, function() {
              var $mask;
              $img.removeData('file');
              $img.removeClass('uploading').removeClass('loading');
              $mask = $img.data('mask');
              if ($mask) {
                $mask.remove();
              }
              $img.removeData('mask');
              _this.editor.trigger('valuechanged');
              if (_this.editor.body.find('img.uploading').length < 1) {
                return _this.editor.uploader.trigger('uploadready', [file, result]);
              }
            });
            if (_this.popover.active) {
              _this.popover.srcEl.prop('disabled', false);
              return _this.popover.srcEl.val(result.file_path);
            }
          };
        })(this));
        return this.editor.uploader.on('uploaderror', (function(_this) {
          return function(e, file, xhr) {
            var $img, msg, result;
            if (!file.inline) {
              return;
            }
            if (xhr.statusText === 'abort') {
              return;
            }
            if (xhr.responseText) {
              try {
                result = JSON.parse(xhr.responseText);
                msg = result.msg;
              } catch (_error) {
                e = _error;
                msg = _this._t('uploadError');
              }
            }
            $img = file.img;
            if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
              return;
            }
            _this.loadImage($img, _this.defaultImage, function() {
              var $mask;
              $img.removeData('file');
              $img.removeClass('uploading').removeClass('loading');
              $mask = $img.data('mask');
              if ($mask) {
                $mask.remove();
              }
              return $img.removeData('mask');
            });
            if (_this.popover.active) {
              _this.popover.srcEl.prop('disabled', false);
              _this.popover.srcEl.val(_this.defaultImage);
            }
            _this.editor.trigger('valuechanged');
            if (_this.editor.body.find('img.uploading').length < 1) {
              return _this.editor.uploader.trigger('uploadready', [file, result]);
            }
          };
        })(this));
      },

      _status : function() {
        return this._disableStatus();
      },

      loadImage : function($img, src, callback) {
        var $mask, img, positionMask;
        positionMask = (function(_this) {
          return function() {
            var imgOffset, wrapperOffset;
            imgOffset = $img.offset();
            wrapperOffset = _this.editor.wrapper.offset();
            return $mask.css({
              top: imgOffset.top - wrapperOffset.top,
              left: imgOffset.left - wrapperOffset.left,
              width: $img.width(),
              height: $img.height()
            }).show();
          };
        })(this);
        $img.addClass('loading');
        $mask = $img.data('mask');
        if (!$mask) {
          $mask = $('<div class="wordpad-image-loading">\n  <div class="progress"></div>\n</div>').hide().appendTo(this.editor.wrapper);
          positionMask();
          $img.data('mask', $mask);
          $mask.data('img', $img);
        }
        img = new Image();
        img.onload = (function(_this) {
          return function() {
            var height, width;
            if (!$img.hasClass('loading') && !$img.hasClass('uploading')) {
              return;
            }
            width = img.width;
            height = img.height;
            $img.attr({
              src: src,
              width: width,
              height: height,
              'data-image-size': width + ',' + height
            }).removeClass('loading');
            if ($img.hasClass('uploading')) {
              _this.editor.editable.util.reflow(_this.editor.body);
              positionMask();
            } else {
              $mask.remove();
              $img.removeData('mask');
            }
            if (langx.isFunction(callback)) {
              return callback(img);
            }
          };
        })(this);
        img.onerror = function() {
          if (langx.isFunction(callback)) {
            callback(false);
          }
          $mask.remove();
          return $img.removeData('mask').removeClass('loading');
        };
        return img.src = src;
      },

      createImage : function(name) {
        var $img, range;
        if (name == null) {
          name = 'Image';
        }
        if (!this.editor.editable.inputManager.focused) {
          this.editor.focus();
        }
        range = this.editor.editable.selection.range();
        range.deleteContents();
        this.editor.editable.selection.range(range);
        $img = $('<img/>').attr('alt', name);
        range.insertNode($img[0]);
        this.editor.editable.selection.setRangeAfter($img, range);
        this.editor.trigger('valuechanged');
        return $img;
      },

      _execute : function(src) {
        var $img;
        $img = this.createImage();
        return this.loadImage($img, src || this.defaultImage, (function(_this) {
          return function() {
            _this.editor.trigger('valuechanged');
            _this.editor.editable.util.reflow($img);
            $img.click();
            return _this.popover.one('popovershow', function() {
              _this.popover.srcEl.focus();
              return _this.popover.srcEl[0].select();
            });
          };
        })(this));
      }

   });

   addons.actions.image = ImageAction; 

   return ImageAction;

});
define('skylark-widgets-wordpad/addons/actions/IndentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var IndentAction = Action.inherit({
      name :'indent',

      icon : 'indent',

      _init : function() {
        var hotkey;
        hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
        this.title = this._t(this.name) + hotkey;
        return Action.prototype._init.call(this);
      },

      _execute : function() {
        return this.editor.editable.indent()
      }

   });


   addons.actions.indent = IndentAction; 

   return IndentAction;
});
define('skylark-widgets-wordpad/addons/actions/ItalicAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  

  var ItalicAction = Action.inherit({
      name : 'italic',

      icon : 'italic',

      htmlTag : 'i',

      disableTag : 'pre',

      shortcut : 'cmd+i',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + " ( Cmd + i )";
        } else {
          this.title = this.title + " ( Ctrl + i )";
          this.shortcut = 'ctrl+i';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('italic');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.italic();
      }
   });


   addons.actions.italic = ItalicAction; 

   return ItalicAction;

});
define('skylark-widgets-wordpad/addons/actions/LinkPopover',[
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  var LinkPopover = Popover.inherit({
    render : function() {
      var tpl;
      tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkText')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\"\n      tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-unlink\"></span>\n    </a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkTarget')) + "</label>\n    <select class=\"link-target\">\n      <option value=\"_blank\">" + (this._t('openLinkInNewWindow')) + " (_blank)</option>\n      <option value=\"_self\">" + (this._t('openLinkInCurrentWindow')) + " (_self)</option>\n    </select>\n  </div>\n</div>";
      this.el.addClass('link-popover').append(tpl);
      this.textEl = this.el.find('.link-text');
      this.urlEl = this.el.find('.link-url');
      this.unlinkEl = this.el.find('.btn-unlink');
      this.selectTarget = this.el.find('.link-target');
      this.textEl.on('keyup', (function(_this) {
        return function(e) {
          if (e.which === 13) {
            return;
          }
          _this.target.text(_this.textEl.val());
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      this.urlEl.on('keyup', (function(_this) {
        return function(e) {
          var val;
          if (e.which === 13) {
            return;
          }
          val = _this.urlEl.val();
          if (!(/^(http|https|ftp|ftps|file)?:\/\/|^(mailto|tel)?:|^\//ig.test(val) || !val)) {
            val = 'http://' + val;
          }
          _this.target.attr('href', val);
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      $([this.urlEl[0], this.textEl[0]]).on('keydown', (function(_this) {
        return function(e) {
          var range;
          if (e.which === 13 || e.which === 27 || (!e.shiftKey && e.which === 9 && $(e.target).hasClass('link-url'))) {
            e.preventDefault();
            range = document.createRange();
            _this.editor.editable.selection.setRangeAfter(_this.target, range);
            _this.hide();
            return _this.editor.editable.inputManager.throttledValueChanged();
          }
        };
      })(this));
      this.unlinkEl.on('click', (function(_this) {
        return function(e) {
          var range, txtNode;
          txtNode = document.createTextNode(_this.target.text());
          _this.target.replaceWith(txtNode);
          _this.hide();
          range = document.createRange();
          _this.editor.editable.selection.setRangeAfter(txtNode, range);
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      return this.selectTarget.on('change', (function(_this) {
        return function(e) {
          _this.target.attr('target', _this.selectTarget.val());
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
    },

    show : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      this.textEl.val(this.target.text());
      return this.urlEl.val(this.target.attr('href'));
    }
  });

  return LinkPopover;
});
define('skylark-widgets-wordpad/addons/actions/LinkAction',[
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
define('skylark-widgets-wordpad/addons/actions/ListAction',[
  "skylark-domx-noder",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(noder,$,addons,Action){ 
  var ListAction = Action.inherit({
    type : '',

    disableTag : 'pre, table',

    _execute : function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    }

   });



    return ListAction;
	
});
define('skylark-widgets-wordpad/addons/actions/MarkAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 


  var MarkAction = Action.inherit({
    name : 'mark',

    icon : 'mark',

    htmlTag : 'mark',

    disableTag : 'pre, table',

    _execute : function() {
      var $end, $start, range;
      range = this.editor.editable.selection.range();
      if (this.active) {
        this.editor.editable.selection.save();
        this.unmark(range);
        this.editor.editable.selection.restore();
        this.editor.trigger('valuechanged');
        return;
      }
      if (range.collapsed) {
        return;
      }
      this.editor.editable.selection.save();
      $start = $(range.startContainer);
      $end = $(range.endContainer);
      if ($start.closest('mark').length) {
        range.setStartBefore($start.closest('mark')[0]);
      }
      if ($end.closest('mark').length) {
        range.setEndAfter($end.closest('mark')[0]);
      }
      this.mark(range);
      this.editor.editable.selection.restore();
      this.editor.trigger('valuechanged');
      if (this.editor.editable.util.support.onselectionchange) {
        return this.editor.trigger('selectionchanged');
      }
    },

    mark : function(range) {
      var $contents, $mark;
      if (range == null) {
        range = this.editor.editable.selection.range();
      }
      $contents = $(range.extractContents());
      $contents.find('mark').each(function(index, ele) {
        return $(ele).replaceWith($(ele).html());
      });
      $mark = $('<mark>').append($contents);
      return range.insertNode($mark[0]);
    },

    unmark : function(range) {
      var $mark;
      if (range == null) {
        range = this.editor.editable.selection.range();
      }
      if (range.collapsed) {
        $mark = $(range.commonAncestorContainer);
        if (!$mark.is('mark')) {
          $mark = $mark.parent();
        }
      } else if ($(range.startContainer).closest('mark').length) {
        $mark = $(range.startContainer).closest('mark');
      } else if ($(range.endContainer).closest('mark').length) {
        $mark = $(range.endContainer).closest('mark');
      }
      return $mark.replaceWith($mark.html());
    }

  });

  
  addons.actions.mark = MarkAction;

  return MarkAction;

 }); 
define('skylark-widgets-wordpad/addons/actions/OrderListAction',[
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
  var OrderListAction = ListAction.inherit({
    type : 'ol',

    name : 'ol',

    icon : 'list-ol',

    htmlTag : 'ol',

    shortcut : 'cmd+/',

    _init : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + / )';
      } else {
        this.title = this.title + ' ( ctrl + / )';
        this.shortcut = 'ctrl+/';
      }
      return ListAction.prototype._init.call(this);
    }

   });

    return addons.actions.ol = OrderListAction;	
});
define('skylark-widgets-wordpad/addons/actions/OutdentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  var OutdentAction = Action.inherit({
    name : 'outdent',

    icon : 'outdent',

    _init : function() {
      var hotkey;
      hotkey = this.editor.opts.tabIndent === false ? '' : ' (Shift + Tab)';
      this.title = this._t(this.name) + hotkey;
      return Action.prototype._init.call(this);
    },

    _status : function() {},

    _execute : function() {
      return this.editor.editable.outdent();
    }

   });


   addons.actions.outdent = OutdentAction; 
 
   return OutdentAction;

});
define('skylark-widgets-wordpad/addons/actions/StrikethroughAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
  var StrikethroughAction = Action.inherit({
    name : 'strikethrough',

    icon : 'strikethrough',

    htmlTag : 'strike',

    disableTag : 'pre',

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('strikethrough');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.strikethrough();
    }

  });


  return addons.actions.strikethrough = StrikethroughAction;	
});
define('skylark-widgets-wordpad/addons/actions/TableAction',[
  "skylark-langx/langx",
  "skylark-domx-tables",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(langx,tables,$,addons,Action){ 
  var TableAction = Action.inherit({
    name : 'table',

    icon : 'table',

    htmlTag : 'table',

    disableTag : 'pre, li, blockquote',

    menu : true,

    _init : function() {
      Action.prototype._init.call(this);
      langx.merge(this.editor.editable.formatter._allowedTags, ['thead', 'th', 'tbody', 'tr', 'td', 'colgroup', 'col']);
      langx.extend(this.editor.editable.formatter._allowedAttributes, {
        td: ['rowspan', 'colspan'],
        col: ['width']
      });
      langx.extend(this.editor.editable.formatter._allowedStyles, {
        td: ['text-align'],
        th: ['text-align']
      });
      this._initShortcuts();
      this._initResize();
      this.editor.on('decorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.decorate($(table));
          });
        };
      })(this));
      this.editor.on('undecorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.undecorate($(table));
          });
        };
      })(this));
      this.editor.on('selectionchanged.table', (function(_this) {
        return function(e) {
          var $container, range;
          _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
          range = _this.editor.editable.selection.range();
          if (!range) {
            return;
          }
          $container = _this.editor.editable.selection.containerNode();
          if (range.collapsed && $container.is('.wordpad-table')) {
            _this.editor.editable.selection.setRangeAtEndOf($container);
          }
          return $container.closest('td, th', _this.editor.body).addClass('active');
        };
      })(this));
      this.editor.on('blur.table', (function(_this) {
        return function(e) {
          return _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('down', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
      return this.editor.editable.keystroke.add('down', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
    },

    _tdNav : function($td, direction) {
      var $anotherTr, $tr, action, anotherTag, index, parentTag, ref;
      if (direction == null) {
        direction = 'up';
      }
      action = direction === 'up' ? 'prev' : 'next';
      ref = direction === 'up' ? ['tbody', 'thead'] : ['thead', 'tbody'], parentTag = ref[0], anotherTag = ref[1];
      $tr = $td.parent('tr');
      $anotherTr = this["_" + action + "Row"]($tr);
      if (!($anotherTr.length > 0)) {
        return true;
      }
      index = $tr.find('td, th').index($td);
      return this.editor.editable.selection.setRangeAtEndOf($anotherTr.find('td, th').eq(index));
    },

    _initResize : function() {

      tables.resizable(document,{
        cssClasses : {
          resizeHandle : "wordpad-resize-handle",
          wrapper : "wordpad-table"
        }
      });

    },

    _initShortcuts : function() {
      this.editor.editable.hotkeys.add('ctrl+alt+up', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+down', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+left', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
          return false;
        };
      })(this));
      return this.editor.editable.hotkeys.add('ctrl+alt+right', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
          return false;
        };
      })(this));
    },

    renderMenu : function() {
      var $table;
      $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (this._t('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (this._t('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (this._t('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
      this.createMenu = this.menuWrapper.find('.menu-create-table');
      this.editMenu = this.menuWrapper.find('.menu-edit-table');
      $table = this.createTable(6, 6).appendTo(this.createMenu);
      this.createMenu.on('mouseenter', 'td, th', (function(_this) {
        return function(e) {
          var $td, $tr, $trs, num;
          _this.createMenu.find('td, th').removeClass('selected');
          $td = $(e.currentTarget);
          $tr = $td.parent();
          num = $tr.find('td, th').index($td) + 1;
          $trs = $tr.prevAll('tr').addBack();
          if ($tr.parent().is('tbody')) {
            $trs = $trs.add($table.find('thead tr'));
          }
          return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
        };
      })(this));
      this.createMenu.on('mouseleave', function(e) {
        return $(e.currentTarget).find('td, th').removeClass('selected');
      });
      return this.createMenu.on('mousedown', 'td, th', (function(_this) {
        return function(e) {
          var $closestBlock, $td, $tr, colNum, rowNum;
          _this.wrapper.removeClass('menu-on');
          if (!_this.editor.editable.inputManager.focused) {
            return;
          }
          $td = $(e.currentTarget);
          $tr = $td.parent();
          colNum = $tr.find('td').index($td) + 1;
          rowNum = $tr.prevAll('tr').length + 1;
          if ($tr.parent().is('tbody')) {
            rowNum += 1;
          }
          $table = _this.createTable(rowNum, colNum, true);
          $closestBlock = _this.editor.editable.selection.blockNodes().last();
          if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
            $closestBlock.replaceWith($table);
          } else {
            $closestBlock.after($table);
          }
          _this.decorate($table);
          _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
          _this.editor.trigger('valuechanged');
          return false;
        };
      })(this));
    },

    decorate : function($table) {
      return $(tables.decorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },

    undecorate : function($table) {
      return $(tables.undecorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },


    createTable : function(row, col, phBr) {
      return $(tables.createTable(row,col,phBr ? this.editor.editable.util.phBr : null));
    },

    refreshTableWidth : function($table) {
      return table.refreshTableWidth($table[0]);
    },

    deleteRow : function($td) {
      var self = this,
          ret; 

      tables.deleteRow($td[0],function(newTr,index){
        if (newTr) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTr).find('td, th').eq(index));
        }
      })

      return ret;
    },

    insertRow : function($td, direction) {
      var self = this,
          ret; 

      tables.insertRow($td[0],direction,self.editor.editable.util.phBr,function(newTr,index){
        ret =  self.editor.editable.selection.setRangeAtStartOf($(newTr).find('td, th').eq(index));
      })

      return ret;

    },

    deleteCol : function($td) {
      var self = this,
          ret; 

      tables.deleteCol($td[0],function(newTd){
        if (newTd) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTd));
        }
      })

      return ret;
    },

    insertCol : function($td, direction) {
      var self = this,
          ret; 

      tables.insertCol($td[0],direction,self.editor.editable.util.phBr,function(newTd){
        ret = self.editor.editable.selection.setRangeAtStartOf($(newTd));
      })

      return ret;
    },

    deleteTable : function($td) {
      var self = this;
      tables.deleteTable($td[0],function($block){
        if ($block.length > 0) {
          return self.editor.editable.selection.setRangeAtStartOf($block);
        }
      });
    },

    _execute : function(param) {
      var $td;
      $td = this.editor.editable.selection.containerNode().closest('td, th');
      if (!($td.length > 0)) {
        return;
      }
      if (param === 'deleteRow') {
        this.deleteRow($td);
      } else if (param === 'insertRowAbove') {
        this.insertRow($td, 'before');
      } else if (param === 'insertRowBelow') {
        this.insertRow($td);
      } else if (param === 'deleteCol') {
        this.deleteCol($td);
      } else if (param === 'insertColLeft') {
        this.insertCol($td, 'before');
      } else if (param === 'insertColRight') {
        this.insertCol($td);
      } else if (param === 'deleteTable') {
        this.deleteTable($td);
      } else {
        return;
      }
      return this.editor.trigger('valuechanged');
    }

   });


  addons.actions.table = TableAction;

  return TableAction;

});
define('skylark-widgets-wordpad/addons/actions/TitleAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var TitleAction = Action.inherit({
    name : 'title',

    htmlTag : 'h1, h2, h3, h4, h5',

    disableTag : 'pre, table',

    _init : function() {
      this.menu = [
        {
          name: 'normal',
          text: i18n.translate('normalText'),
          param: 'p'
        }, '|', {
          name: 'h1',
          text: i18n.translate('title') + ' 1',
          param: 'h1'
        }, {
          name: 'h2',
          text: i18n.translate('title') + ' 2',
          param: 'h2'
        }, {
          name: 'h3',
          text: i18n.translate('title') + ' 3',
          param: 'h3'
        }, {
          name: 'h4',
          text: i18n.translate('title') + ' 4',
          param: 'h4'
        }, {
          name: 'h5',
          text: i18n.translate('title') + ' 5',
          param: 'h5'
        }
      ];
      return Action.prototype._init.call(this);
    },

    setActive : function(active, param) {
      if (active) {
        active = this.node[0].tagName.toLowerCase();
      }
      Action.prototype.setActive.call(this, active);
    },

    _execute : function(param) {
      return this.editor.editable.title(param,this.disableTag);
    }

  });

  addons.actions.title = TitleAction;

  return TitleAction;

});
define('skylark-widgets-wordpad/addons/actions/UnderlineAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){
  var UnderlineAction = Action.inherit({
    name : 'underline',

    icon : 'underline',

    htmlTag : 'u',

    disableTag : 'pre',

    shortcut : 'cmd+u',

    render : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + u )';
      } else {
        this.title = this.title + ' ( Ctrl + u )';
        this.shortcut = 'ctrl+u';
      }
      return Action.prototype.render.call(this);
    },

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('underline');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.underline();
    }

   });


  addons.actions.underline = UnderlineAction;

  return UnderlineAction;

});
define('skylark-widgets-wordpad/addons/actions/UnorderListAction',[
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
   var UnorderListAction = ListAction.inherit({
      type : 'ul',

      name : 'ul',

      icon : 'list-ul',

      htmlTag : 'ul',

      shortcut : 'cmd+.',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + . )';
        } else {
          this.title = this.title + ' ( Ctrl + . )';
          this.shortcut = 'ctrl+.';
        }
        return ListAction.prototype._init.call(this);
      }

   });


    addons.actions.ul = UnorderListAction;

    return UnorderListAction;

});
define('skylark-widgets-wordpad/addons/toolbar/items/AlignmentButton',[
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
define('skylark-widgets-wordpad/addons/toolbar/items/ColorButton',[
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function($,ToolButton,i18n,addons){ 
  

   var ColorButton = ToolButton.inherit({
    render : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      return ToolButton.prototype.render.apply(this, args);
    },

    renderMenu : function() {
      $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default"></a></li>\n</ul>').appendTo(this.menuWrapper);
      this.menuWrapper.on('mousedown', '.color-list', function(e) {
        return false;
      });
      return this.menuWrapper.on('click', '.font-color', (function(_this) {
        return function(e) {
          var $link, $p, hex, range, rgb, textNode;
          _this.wrapper.removeClass('menu-on');
          $link = $(e.currentTarget);
          if ($link.hasClass('font-color-default')) {
            $p = _this.editor.body.find('p, li');
            if (!($p.length > 0)) {
              return;
            }
            rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
            hex = _this._convertRgbToHex(rgb);
          } else {
            rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
            hex = _this._convertRgbToHex(rgb);
          }
          if (!hex) {
            return;
          }

          return _this.editor.editable.fontColor(hex,$link.hasClass('font-color-default'),i18n.translate('coloredText'));
        };
      })(this));
    },

    _convertRgbToHex : function(rgb) {
      var match, re, rgbToHex;
      re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
      match = re.exec(rgb);
      if (!match) {
        return '';
      }
      rgbToHex = function(r, g, b) {
        var componentToHex;
        componentToHex = function(c) {
          var hex;
          hex = c.toString(16);
          if (hex.length === 1) {
            return '0' + hex;
          } else {
            return hex;
          }
        };
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      };
      return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
    }

   });

   
   addons.toolbar.items.color = ColorButton; 


   return ColorButton;
	
});
define('skylark-widgets-wordpad/addons/toolbar/items/EmojiButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function(langx, $,ToolButton,i18n,addons){ 

  var EmojiButton = ToolButton.inherit({

    renderMenu : function() {
      var $list, dir, html, name, opts, src, tpl, _i, _len, _ref;
      tpl = '<ul class="emoji-list">\n</ul>';
      opts = langx.extend({
        imagePath: 'images/emoji/',
        images: EmojiButton.images
      }, this.editor.opts.emoji || {});
      html = "";
      dir = opts.imagePath.replace(/\/$/, '') + '/';
      _ref = opts.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        src = "" + dir + name;
        name = name.split('.')[0];
        html += "<li data-name='" + name + "'><img src='" + src + "' width='20' height='20' alt='" + name + "' /></li>";
      }
      $list = $(tpl);
      $list.html(html).appendTo(this.menuWrapper);
      return $list.on('mousedown', 'li', (function(_this) {
        return function(e) {
          var $img;
          _this.wrapper.removeClass('menu-on');
          if (!_this.editor.editable.inputManager.focused) {
            return;
          }
          $img = $(e.currentTarget).find('img').clone().attr({
            'data-emoji': true,
            'data-non-image': true
          });
          _this.editor.editable.selection.insertNode($img);
          _this.editor.trigger('valuechanged');
          _this.editor.trigger('selectionchanged');
          return false;
        };
      })(this));
    }

  });


  EmojiButton.i18n = {
    'zh-CN': {
      emoji: '表情'
    },
    'en-US': {
      emoji: 'emoji'
    }
  };

  EmojiButton.images = ['smile.png', 'smiley.png', 'laughing.png', 'blush.png', 'heart_eyes.png', 'smirk.png', 'flushed.png', 'grin.png', 'wink.png', 'kissing_closed_eyes.png', 'stuck_out_tongue_winking_eye.png', 'stuck_out_tongue.png', 'sleeping.png', 'worried.png', 'expressionless.png', 'sweat_smile.png', 'cold_sweat.png', 'joy.png', 'sob.png', 'angry.png', 'mask.png', 'scream.png', 'sunglasses.png', 'heart.png', 'broken_heart.png', 'star.png', 'anger.png', 'exclamation.png', 'question.png', 'zzz.png', 'thumbsup.png', 'thumbsdown.png', 'ok_hand.png', 'punch.png', 'v.png', 'clap.png', 'muscle.png', 'pray.png', 'skull.png', 'trollface.png'];


  addons.toolbar.items.emoji = EmojiButton; 

  return EmojiButton;
	
});
define('skylark-widgets-wordpad/addons/toolbar/items/TableButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function(langx, $,ToolButton,i18n,addons){ 

  var TableButton = ToolButton.inherit({
    _doActive : function(active) {

      ToolButton.prototype._doActive.call(this, active);

      if (active) {
        this.createMenu.hide();
        return this.editMenu.show();
      } else {
        this.createMenu.show();
        return this.editMenu.hide();
      }

    }
   });


  TableButton.prototype.renderMenu = function() {
    var $table;
    $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (i18n.translate('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (i18n.translate('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (i18n.translate('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (i18n.translate('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (i18n.translate('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (i18n.translate('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (i18n.translate('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
    this.createMenu = this.menuWrapper.find('.menu-create-table');
    this.editMenu = this.menuWrapper.find('.menu-edit-table');
    $table = this.action.createTable(6, 6).appendTo(this.createMenu);
    this.createMenu.on('mouseenter', 'td, th', (function(_this) {
      return function(e) {
        var $td, $tr, $trs, num;
        _this.createMenu.find('td, th').removeClass('selected');
        $td = $(e.currentTarget);
        $tr = $td.parent();
        num = $tr.find('td, th').index($td) + 1;
        $trs = $tr.prevAll('tr').addBack();
        if ($tr.parent().is('tbody')) {
          $trs = $trs.add($table.find('thead tr'));
        }
        return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
      };
    })(this));
    this.createMenu.on('mouseleave', function(e) {
      return $(e.currentTarget).find('td, th').removeClass('selected');
    });
    return this.createMenu.on('mousedown', 'td, th', (function(_this) {
      return function(e) {
        var $closestBlock, $td, $tr, colNum, rowNum;
        _this.wrapper.removeClass('menu-on');
        if (!_this.editor.editable.inputManager.focused) {
          return;
        }
        $td = $(e.currentTarget);
        $tr = $td.parent();
        colNum = $tr.find('td').index($td) + 1;
        rowNum = $tr.prevAll('tr').length + 1;
        if ($tr.parent().is('tbody')) {
          rowNum += 1;
        }
        $table = _this.action.createTable(rowNum, colNum, true);
        $closestBlock = _this.editor.editable.selection.blockNodes().last();
        if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
          $closestBlock.replaceWith($table);
        } else {
          $closestBlock.after($table);
        }
        _this.action.decorate($table);
        _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
        _this.editor.trigger('valuechanged');
        return false;
      };
    })(this));
  };


  addons.toolbar.items.table = TableButton;

  return TableButton;


});
define('skylark-widgets-wordpad/addons/toolbar/items/TitleButton',[
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../addons"
],function($,ToolButton,addons){ 
  var TitleButton = ToolButton.inherit({
      _doActive : function(value) {
        var active = !!value,
            param = value;
        ToolButton.prototype._doActive.call(this, active);

        if (active) {
          param || (param = this.node[0].tagName.toLowerCase());
        }
        this.el.removeClass('active-p active-h1 active-h2 active-h3 active-h4 active-h5');
        if (active) {
          return this.el.addClass('active active-' + param);
        }
      }
   });


  addons.toolbar.items.title = TitleButton;

  return TitleButton;

});
define('skylark-widgets-base/Addon',[
  "skylark-langx/langx",	
  "skylark-langx/Evented",
	"./base"
],function(langx,Evented,base){

	var Addon = Evented.inherit({

		_construct : function(widget,options) {
			this._widget = widget;
            Object.defineProperty(this,"options",{
              value :langx.mixin({},this.options,options,true)
            });
			if (this._init) {
				this._init();
			}
		}

	});

	Addon.register = function(Widget) {
		var categoryName = this.categoryName,
			addonName = this.addonName;

		if (categoryName && addonName) {
			Widget.addons = Widget.addons || {};
			Widget.addons[categoryName] = Widget.addons[categoryName] || {};
			Widget.addons[categoryName][addonName] = this;
		}
	};

	return base.Addon = Addon;

});
define('skylark-widgets-wordpad/addons/AutoSave',[
  "skylark-domx-query",
  "skylark-widgets-base/Addon",
  "../Toolbar",
  "../Wordpad",
  "../i18n"
],function($,Addon, Toolbar,Wordpad,i18n){ 


  var AutoSave = Addon.inherit({
    needFocus : false,

    _init : function() {

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


  AutoSave.categoryName = "general";
  AutoSave.addonName = 'autosave';

  AutoSave.prototype.opts = {
    autosave: true,
    autosavePath: null
  };


  AutoSave.prototype.storage = {
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

  return Wordpad.addons.general.autoSave = AutoSave;

});
define('skylark-widgets-wordpad/addons/Dropzone',[
  "skylark-domx-query",
  "skylark-widgets-base/Addon",
  "../Toolbar",
  "../Wordpad",
  "../i18n"
],function($,Addon, Toolbar,Wordpad,i18n){ 


  var Dropzone = Addon.inherit({
  });

  Dropzone.categoryName = "genernal";

  Dropzone.addonName = "dropzone";


  Dropzone.prototype._entered = 0;

  Dropzone.prototype._init = function() {
    this.editor = this._widget;
    if (this.editor.uploader == null) {
      //throw new Error("Can't work without 'simple-uploader' module");
      return;
    }
    $(document.body).on("dragover", function(e) {
      e.originalEvent.dataTransfer.dropEffect = "none";
      return e.preventDefault();
    });
    $(document.body).on('drop', function(e) {
      return e.preventDefault();
    });
    this.imageBtn = this.editor.toolbar.findButton("image");
    return this.editor.body.on("dragover", function(e) {
      e.originalEvent.dataTransfer.dropEffect = "copy";
      e.stopPropagation();
      return e.preventDefault();
    }).on("dragenter", (function(_this) {
      return function(e) {
        if ((_this._entered += 1) === 1) {
          _this.show();
        }
        e.preventDefault();
        return e.stopPropagation();
      };
    })(this)).on("dragleave", (function(_this) {
      return function(e) {
        if ((_this._entered -= 1) <= 0) {
          _this.hide();
        }
        e.preventDefault();
        return e.stopPropagation();
      };
    })(this)).on("drop", (function(_this) {
      return function(e) {
        var file, imageFiles, _i, _j, _len, _len1, _ref;
        imageFiles = [];
        _ref = e.originalEvent.dataTransfer.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (!_this.validFile(file)) {
            alert("「" + file.name + "]」文件不是图片。");
            _this.hide();
            return false;
          }
          imageFiles.push(file);
        }
        for (_j = 0, _len1 = imageFiles.length; _j < _len1; _j++) {
          file = imageFiles[_j];
          _this.editor.uploader.upload(file, {
            inline: true
          });
        }
        _this.hide();
        e.stopPropagation();
        return e.preventDefault();
      };
    })(this));
  };

  Dropzone.prototype.show = function() {
    return this.imageBtn.setActive(true);
  };

  Dropzone.prototype.hide = function() {
    this.imageBtn.setActive(false);
    return this._entered = 0;
  };

  Dropzone.prototype.validFile = function(file) {
    return file.type.indexOf("image/") > -1;
  };

  return Wordpad.addons.general.dropzone = Dropzone;


});
define('skylark-widgets-wordpad/main',[
  "./Wordpad", 
  "./Action",
  "./Popover",
  "./Toolbar",
  "./ToolButton", 

  "./addons/actions/AlignmentAction", 
  "./addons/actions/BlockquoteAction", 
  "./addons/actions/BoldAction", 
  "./addons/actions/CodeAction", 
  "./addons/actions/CodePopover", 
  "./addons/actions/ColorAction", 
  "./addons/actions/EmojiAction", 
  "./addons/actions/FontScaleAction", 
  "./addons/actions/FullScreenAction", 
  "./addons/actions/HrAction", 
  "./addons/actions/HtmlAction", 
  "./addons/actions/ImageAction", 
  "./addons/actions/ImagePopover", 
  "./addons/actions/IndentAction", 
  "./addons/actions/ItalicAction", 
  "./addons/actions/LinkAction", 
  "./addons/actions/LinkPopover", 
  "./addons/actions/ListAction", 
  "./addons/actions/MarkAction", 
  "./addons/actions/OrderListAction", 
  "./addons/actions/OutdentAction",
  "./addons/actions/StrikethroughAction", 
  "./addons/actions/TableAction", 
  "./addons/actions/TitleAction", 
  "./addons/actions/UnderlineAction", 
  "./addons/actions/UnorderListAction",

  "./addons/toolbar/items/AlignmentButton",
  "./addons/toolbar/items/ColorButton",
  "./addons/toolbar/items/EmojiButton",
  "./addons/toolbar/items/TableButton",
  "./addons/toolbar/items/TitleButton",

  "./addons/AutoSave",
  "./addons/Dropzone"
],function(Wordpad){
	
  return Wordpad;
});
define('skylark-widgets-wordpad', ['skylark-widgets-wordpad/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-wordpad.js.map
