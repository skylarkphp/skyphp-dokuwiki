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
        'html' : 'HTML源码',
        'emoji' : '表情',
        'mark' : '标记',
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
        'fontScaleXSmall': '超小字体',
        "video": "视屏",
        "videoSize" : "尺寸",
        "uploadVideoBtn" : "插入",
        "videoPlaceholder": "视频嵌入代码"
      },
      'en-US': {
        'html' : 'HTML Source',
        'emoji' : 'Emoji',
        'mark' : 'Mark',
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
        'fontScaleXSmall': 'X Small Size',
        "video": "Video",
        "videoSize" : "Size",
        "uploadVideoBtn" : "Insert",
        "videoPlaceholder": "Video Embed Code"
      },

      'ja' : {
        'html' : 'HTMLソースコード',
        'emoji' : '表情',
        'mark' : 'マーク',
        'blockquote': 'ブロック引用文',
        'bold': '太字',
        'code': 'コードを挿入',
        'color': 'フォントの色',
        'coloredText': 'カラー文字',
        'hr': '水平線',
        'image': 'イメージを挿入',
        'externalImage': '外部イメージ',
        'uploadImage': 'イメージファイルをアップロード',
        'uploadFailed': 'アップロードが失敗しまいた',
        'uploadError': 'アップロードエラー',
        'imageUrl': 'イメージのURL',
        'imageSize': 'イメージのサイズ',
        'imageAlt': 'イメージの説明文',
        'restoreImageSize': 'イメージのサイズを元に戻す',
        'uploading': 'アップロード中',
        'indent': 'インデントを増やす',
        'outdent': 'インデントを減らす',
        'italic': '斜体',
        'link': 'リンクを挿入',
        'linkText': 'リンクテキスト',
        'linkUrl': 'リンクURL',
        'linkTarget': 'リンクの表示先を指定',
        'openLinkInCurrentWindow': '同じウィンドウで開く',
        'openLinkInNewWindow': '新規ウインドウで開く',
        'removeLink': 'リンクを削除',
        'ol': '段落番号',
        'ul': '箇条書き',
        'strikethrough': '取消線',
        'table': 'テーブル',
        'deleteRow': '行を削除',
        'insertRowAbove': '上に行を挿入',
        'insertRowBelow': '下に行を挿入',
        'deleteColumn': '列を削除',
        'insertColumnLeft': '左に列を挿入',
        'insertColumnRight': '右に列を挿入',
        'deleteTable': 'テーブルを削除',
        'title': 'タイトル',
        'normalText': '標準',
        'underline': '下線',
        'alignment': '位置',
        'alignCenter': '中央揃え',
        'alignLeft': '左揃え',
        'alignRight': '右揃え',
        'selectLanguage': '言語を選択',
        'fontScale': 'フォントのサイズ',
        'fontScaleXLarge': '超大きいサイズ',
        'fontScaleLarge': '大きいサイズ',
        'fontScaleNormal': '通常サイズ',
        'fontScaleSmall': '小さいサイズ',
        'fontScaleXSmall': '超小さいサイズ',
        "video": "ビデオ",
        "videoSize" : "サイズ",
        "uploadVideoBtn" : "挿入",
        "videoPlaceholder": "ビデオ埋め込みコード"
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
      return this.el.toggleClass('active', value);
    },

    _doDisabled : function(value) {
      return this.el.toggleClass('disabled', value);
    },

    iconClassOf : function(icon) {
      if (icon) {
        if (this.editor.options.classes.icons[icon]) {
          return this.editor.options.classes.icons[icon];
        } else {
          return "wordpad-icon wordpad-icon-" + icon;
        }
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
        return this.action.tooltip || i18n.translate(this.action.name);
;
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
  "skylark-domx-query",
  "skylark-net-http/Xhr"
],function(langx,$,Xhr){ 

  var Uploader = langx.Evented.inherit({
    init : function(options){
      this.options = langx.mixin({},this.options,options);

      this.files = [];
      this.queue = [];
      this.id = ++Uploader.count;
      this.on('uploadcomplete', (function(_this) {
        return function(e, file) {
          _this.files.splice(langx.inArray(file, _this.files), 1);
          if (_this.queue.length > 0 && _this.files.length < _this.options.connectionCount) {
            return _this.upload(_this.queue.shift());
          } else {
            return _this.uploading = false;
          }
        };
      })(this));
      $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
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

  Uploader.prototype.options = {
    url: '',
    params: null,
    fileKey: 'upload_file',
    connectionCount: 3,
    headers: null
  };



  Uploader.prototype.generateId = (function() {
    var id;
    id = 0;
    return function() {
      return id += 1;
    };
  })();

  Uploader.prototype.upload = function(file, options) {
    var f, i, key, len;
    if (options == null) {
      options = {};
    }
    if (file == null) {
      return;
    }
    if (langx.isArray(file) || file instanceof FileList) {
      for (i = 0, len = file.length; i < len; i++) {
        f = file[i];
        this.upload(f, options);
      }
    } else if ($(file).is('input:file')) {
      key = $(file).attr('name');
      if (key) {
        options.fileKey = key;
      }
      this.upload(langx.makeArray($(file)[0].files), options);
    } else if (!file.id || !file.obj) {
      file = this.getFile(file);
    }
    if (!(file && file.obj)) {
      return;
    }
    langx.extend(file, options);
    if (this.files.length >= this.options.connectionCount) {
      this.queue.push(file);
      return;
    }
    if (this.trigger('beforeupload', file) === false) {
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
      url: this.options.url,
      params: this.options.params,
      fileKey: this.options.fileKey,
      name: name,
      headers : this.options.headers,
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
    var xhr =  file.xhr = new Xhr({
      url: this.options.url
    });

    var headers = {
        'X-File-Name': encodeURIComponent(file.name)
    };

    if (file.headers) {
      ref = file.headers;
      for (k in ref) {
        v = ref[k];
        headers[k] =  v;
      }
    }

    var _this = this;

    xhr.post({
      data: formData,
      processData: false,
      contentType: false,
      headers: headers
    }).progress(function(e){
      if (!e.lengthComputable) {
        return;
      }
      return _this.trigger('uploadprogress', file, e.loaded, e.total);
    }).then(function(result){
      _this.trigger('uploadsuccess', file, result);

      _this.trigger('uploadcomplete');

    }).catch(function(e,status){
      _this.trigger('uploaderror', file,xhr);
      _this.trigger('uploadcomplete');
    });

    return xhr;
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

  return  function(options) {
    return new Uploader(options);
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

      this.toolbar = new Toolbar(this,{
        toolbar: this.options.toolbar,
        toolbarFloat:  this.options.toolbarFloat,
        toolbarHidden:  this.options.toolbarHidden,
        toolbarFloatOffset:  this.options.toolbarFloatOffset

      });

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
    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.options.indentWidth)) {
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

  Action.i18n = i18n;
  
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
define('skylark-widgets-wordpad/addons/actions/BlockquoteAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'blockquote',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.disableTag);
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
      this.langs = this.editor.options.codeLanguages || [
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

    icon : 'fontColor',

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

    icon : 'emoji',

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

    icon : 'fontScale',

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

    icon : "fullscreen",

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);

      this.window = $(window);
      this.body = $('body');
      this.editable = this.editor.body;
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
              height: _this.window.height() - $(_this.editor.toolbar._elm).outerHeight() - editablePadding
            });
          };
        })(this));
      } else {
        this.window.off("resize.wordpad-fullscreen-" + this.editor.id);
        //this._resize({
        //  height: 'auto'
        //});
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

	  icon : 'hr',

	  htmlTag : 'hr',

	  _status : function() {},

	  _execute : function() {
	    return this.editor.editable.hr();
	  }

   });


  addons.actions.hr = HrAction; 

  return HrAction;	
});
define('skylark-codemirror/addon/beautify/beautify',[
  "skylark-langx/langx",
  "../../CodeMirror"
], function(langx,CodeMirror) {
  'use strict';
  var Pos = CodeMirror.Pos;

  var defaultOptions = {
    initialBeautify: true,
    autoBeautify: true,
    javascript: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['}', ']', ';'].indexOf(change.text[0]) !== -1;
      }
    },
    css: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['}', ';'].indexOf(change.text[0]) !== -1;
      }
    },
    html: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['>'].indexOf(change.text[0]) !== -1;
      }
    }
  };

  function getOptions (cm) {
    if (!cm || !cm.doc || !cm.doc.mode || !cm.state)
      return;

    if (cm.doc.mode.name === 'javascript')
      return cm.state.beautify.javascript;
    else if (cm.doc.mode.name === 'css')
      return cm.state.beautify.css;
    else if (cm.doc.mode.name === 'htmlmixed')
      return cm.state.beautify.html;
  }

  function beautify (cm) {
    var options = getOptions(cm);

    if (options && options.beautifyFunc)
      cm.setValue(options.beautifyFunc(cm.getValue(), options));
  }

  function shouldComplete(cm, change) {
    var options = getOptions(cm);

    if (options.completionFunc)
      return options.completionFunc(cm, change);

    return false;
  }

  function onChange (cm, change) {
    if (cm.state.beautify && !cm.state.beautify.autoBeautify)
      return;

    if (shouldComplete(cm, change)) {
      var bracketChar = change.text[0];
      var bracketCount = cm.getRange(new Pos(0, 0), change.to).split(bracketChar).length;

      beautify(cm);

      var searchCount = 0;

      for (var i = 0; i < cm.lineCount(); i++) {
        var offset = -1;
        var lineText = cm.getLine(i);

        while ((offset = lineText.indexOf(bracketChar, offset + 1)) !== -1) {
          searchCount++;

          if (bracketCount === searchCount) {
            cm.setCursor(new Pos(i, offset + 1));
            break;
          }
        }

        if (bracketCount === searchCount)
          break;
      }
    }
  }

  CodeMirror.defineOption('beautify', false, function(cm, val, old) {
    if (old && old !== CodeMirror.Init)
      cm.off('change', onChange);
    if (val) {
      var indentUnit = cm.getOption('indentUnit');

      var cmOptions = {
        javascript: {
          indent_size: indentUnit
        },
        css: {
          indent_size: indentUnit
        },
        html: {
          indent_size: indentUnit
        }
      };

      if (typeof val === 'object')
        cm.state.beautify = langx.mixin({}, defaultOptions, cmOptions, val,true);
      else
        cm.state.beautify = langx.mixin({}, defaultOptions, cmOptions,true);

      if (cm.state.beautify.initialBeautify)
        beautify(cm);

      cm.on('change', onChange);
    }
  });

  CodeMirror.defineExtension('beautify', function () {
    beautify(this);
  });
});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/xml/xml',["../../CodeMirror"], function(CodeMirror) {


var htmlConfig = {
  autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                    'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                    'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                    'track': true, 'wbr': true, 'menuitem': true},
  implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                     'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                     'th': true, 'tr': true},
  contextGrabbers: {
    'dd': {'dd': true, 'dt': true},
    'dt': {'dd': true, 'dt': true},
    'li': {'li': true},
    'option': {'option': true, 'optgroup': true},
    'optgroup': {'optgroup': true},
    'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
          'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
          'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
          'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
          'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
    'rp': {'rp': true, 'rt': true},
    'rt': {'rp': true, 'rt': true},
    'tbody': {'tbody': true, 'tfoot': true},
    'td': {'td': true, 'th': true},
    'tfoot': {'tbody': true},
    'th': {'td': true, 'th': true},
    'thead': {'tbody': true, 'tfoot': true},
    'tr': {'tr': true}
  },
  doNotIndent: {"pre": true},
  allowUnquoted: true,
  allowMissing: true,
  caseFold: true
}

var xmlConfig = {
  autoSelfClosers: {},
  implicitlyClosed: {},
  contextGrabbers: {},
  doNotIndent: {},
  allowUnquoted: false,
  allowMissing: false,
  allowMissingTagName: false,
  caseFold: false
}

CodeMirror.defineMode("xml", function(editorConf, config_) {
  var indentUnit = editorConf.indentUnit
  var config = {}
  var defaults = config_.htmlMode ? htmlConfig : xmlConfig
  for (var prop in defaults) config[prop] = defaults[prop]
  for (var prop in config_) config[prop] = config_[prop]

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    }
  }

  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
          !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return attrState(type, stream, state);
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          config.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if ((state.context && state.context.tagName == tagName) || config.matchClosing === false) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return closeState(type, stream, state);
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          config.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!config.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null}
      if (baseIndent != null) state.baseIndent = baseIndent
      return state
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (config.multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
      }
      if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = config.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: config.htmlMode ? "html" : "xml",
    helperType: config.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState
    }
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/css/css',["../../CodeMirror"], function(CodeMirror) {


CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      lineComment = parserConfig.lineComment,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]*/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if (stream.match(/[\w-.]+(?=\()/)) {
      if (/^(url(-prefix)?|domain|regexp)$/.test(stream.current().toLowerCase())) {
        state.tokenize = tokenParenthesized;
      }
      return ret("variable callee", "variable");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/i.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/i.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/i.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = "string-2";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "meta") return "pseudo";

    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = "string-2";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      if (type != "comment")
        state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    blockCommentContinue: " * ",
    lineComment: lineComment,
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i].toLowerCase()] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backface-visibility",
    "background", "background-attachment", "background-blend-mode", "background-clip",
    "background-color", "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
    "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap",
    "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap",
    "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "justify-items", "justify-self", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
    "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
    "shape-outside", "size", "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break",
    "word-spacing", "word-wrap", "z-index",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "text-anchor", "writing-mode"
  ], propertyKeywords = keySet(propertyKeywords_);

  var nonStandardPropertyKeywords_ = [
    "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
    "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
    "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
    "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
    "searchfield-results-decoration", "zoom"
  ], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

  var fontProperties_ = [
    "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
    "font-stretch", "font-weight", "font-style"
  ], fontProperties = keySet(fontProperties_);

  var counterDescriptors_ = [
    "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
    "speak-as", "suffix", "symbols", "system"
  ], counterDescriptors = keySet(counterDescriptors_);

  var colorKeywords_ = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ], colorKeywords = keySet(colorKeywords_);

  var valueKeywords_ = [
    "above", "absolute", "activeborder", "additive", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
    "compact", "condensed", "contain", "content", "contents",
    "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "dense", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari", "difference",
    "disc", "discard", "disclosure-closed", "disclosure-open", "document",
    "dot-dash", "dot-dot-dash",
    "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
    "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
    "katakana", "katakana-iroha", "keep-all", "khmer",
    "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
    "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten",
    "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "match", "matrix", "matrix3d",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "multiply", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
    "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
    "progress", "push-button", "radial-gradient", "radio", "read-only",
    "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeating-linear-gradient",
    "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
    "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
    "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen",
    "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "tamil",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "trad-chinese-formal", "trad-chinese-informal", "transform",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "unset", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ], valueKeywords = keySet(valueKeywords_);

  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
    .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
    .concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/, false))
          return [null, null]
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/javascript/javascript',["../../CodeMirror"], function(CodeMirror) {


CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.match(/^(?:x[\da-f]+|o[0-7]+|b[01]+)n?/i)) {
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:n|(?:\.\d*)?(?:[eE][+\-]?\d+)?)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eat("=");
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch == "!" || ch == "=") stream.eat("=")
        } else if (/[<>*+\-]/.test(ch)) {
          stream.eat(ch)
          if (ch == ">") stream.eat(ch)
        }
      }
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current()
      if (state.lastType != ".") {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word]
          return ret(kw.type, kw.style, word)
        }
        if (word == "async" && stream.match(/^(\s|\/\*.*?\*\/)*[\[\(\w]/, false))
          return ret("async", "keyword", word)
      }
      return ret("variable", "variable", word)
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    if (isTS) { // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow))
      if (m) arrow = m.index
    }

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function inList(name, list) {
    for (var v = list; v; v = v.next) if (v.name == name) return true
    return false;
  }
  function register(varname) {
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        // FIXME function decls are also not block scoped
        var newContext = registerVarScoped(varname, state.context)
        if (newContext != null) {
          state.context = newContext
          return
        }
      } else if (!inList(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars)
        return
      }
    }
    // Fall through means this is global
    if (parserConfig.globalVars && !inList(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars)
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      return null
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev)
      if (!inner) return null
      if (inner == context.prev) return context
      return new Context(inner, context.vars, true)
    } else if (inList(varname, context.vars)) {
      return context
    } else {
      return new Context(context.prev, new Var(varname, context.vars), false)
    }
  }

  function isModifier(name) {
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly"
  }

  // Combinators

  function Context(prev, vars, block) { this.prev = prev; this.vars = vars; this.block = block }
  function Var(name, next) { this.name = name; this.next = next }

  var defaultVars = new Var("this", new Var("arguments", null))
  function pushcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, false)
    cx.state.localVars = defaultVars
  }
  function pushblockcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, true)
    cx.state.localVars = null
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars
    cx.state.context = cx.state.context.prev
  }
  popcontext.lex = true
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";" || type == "}" || type == ")" || type == "]") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "keyword d") return cx.stream.match(/^\s*$/, false) ? cont() : cont(pushlex("stat"), maybeexpression, expect(";"), poplex);
    if (type == "debugger") return cont(expect(";"));
    if (type == "{") return cont(pushlex("}"), pushblockcontext, block, poplex, popcontext);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "class" || (isTS && value == "interface")) {
      cx.marked = "keyword"
      return cont(pushlex("form", type == "class" ? type : value), className, poplex)
    }
    if (type == "variable") {
      if (isTS && value == "declare") {
        cx.marked = "keyword"
        return cont(statement)
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx.stream.match(/^\s*\w/, false)) {
        cx.marked = "keyword"
        if (value == "enum") return cont(enumdef);
        else if (value == "type") return cont(typename, expect("operator"), typeexpr, expect(";"));
        else return cont(pushlex("form"), pattern, expect("{"), pushlex("}"), block, poplex, poplex)
      } else if (isTS && value == "namespace") {
        cx.marked = "keyword"
        return cont(pushlex("form"), expression, statement, poplex)
      } else if (isTS && value == "abstract") {
        cx.marked = "keyword"
        return cont(statement)
      } else {
        return cont(pushlex("stat"), maybelabel);
      }
    }
    if (type == "switch") return cont(pushlex("form"), parenExpr, expect("{"), pushlex("}", "switch"), pushblockcontext,
                                      block, poplex, poplex, popcontext);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, maybeCatchBinding, statement, poplex, popcontext);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "async") return cont(statement)
    if (value == "@") return cont(expression, statement)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function maybeCatchBinding(type) {
    if (type == "(") return cont(funarg, expect(")"))
  }
  function expression(type, value) {
    return expressionInner(type, value, false);
  }
  function expressionNoComma(type, value) {
    return expressionInner(type, value, true);
  }
  function parenExpr(type) {
    if (type != "(") return pass()
    return cont(pushlex(")"), expression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    if (type == "import") return cont(expression);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^>]|<.*?>)*>\s*\(/, false))
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator"
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1)
      return cont(expr)
    }
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      var m // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword"
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      return cont(objprop);
    } else if (type == ":") {
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(function(type, value) {
          if (type == end || value == end) return pass()
          return pass(what)
        }, proceed);
      }
      if (type == end || value == end) return cont();
      if (sep && sep.indexOf(";") > -1) return pass(what)
      return cont(expect(end));
    }
    return function(type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ":" || value == "in") return cont(typeexpr);
      if (value == "?") return cont(maybetype);
    }
  }
  function mayberettype(type) {
    if (isTS && type == ":") {
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword"
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof" || value == "infer") {
      cx.marked = "keyword"
      return cont(value == "typeof" ? expressionNoComma : typeexpr)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type"
      return cont(afterType)
    }
    if (value == "|" || value == "&") return cont(typeexpr)
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    if (type == "{") return cont(pushlex("}"), commasep(typeprop, "}", ",;"), poplex, afterType)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType, afterType)
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
      return cont(typeprop)
    } else if (value == "?" || type == "number" || type == "string") {
      return cont(typeprop)
    } else if (type == ":") {
      return cont(typeexpr)
    } else if (type == "[") {
      return cont(expect("variable"), maybetype, expect("]"), typeprop)
    } else if (type == "(") {
      return pass(functiondecl, typeprop)
    }
  }
  function typearg(type, value) {
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    if (type == ":") return cont(typeexpr)
    if (type == "spread") return cont(typearg)
    return pass(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    if (type == "[") return cont(typeexpr, expect("]"), afterType)
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
    if (value == "?") return cont(typeexpr, expect(":"), typeexpr)
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(eltpattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    if (type == "[") return cont(expression, expect(']'), expect(':'), proppattern);
    return cont(expect(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    return pass(pattern, maybeAssign)
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type, value) {
    if (value == "await") return cont(forspec);
    if (type == "(") return cont(pushlex(")"), forspec1, poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, forspec2);
    if (type == "variable") return cont(forspec2);
    return pass(forspec2)
  }
  function forspec2(type, value) {
    if (type == ")") return cont()
    if (type == ";") return cont(forspec2)
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression, forspec2) }
    return pass(expression, forspec2)
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function functiondecl(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondecl);}
    if (type == "variable") {register(value); return cont(functiondecl);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondecl)
  }
  function typename(type, value) {
    if (type == "keyword" || type == "variable") {
      cx.marked = "type"
      return cont(typename)
    } else if (value == "<") {
      return cont(pushlex(">"), commasep(typeparam, ">"), poplex)
    }
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg)
    if (type == "spread") return cont(funarg);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
    if (isTS && type == "this") return cont(maybetype, maybeAssign)
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == "variable") return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(isTS ? classfield : functiondef, classBody);
    }
    if (type == "number" || type == "string") return cont(isTS ? classfield : functiondef, classBody);
    if (type == "[")
      return cont(expression, maybetype, expect("]"), isTS ? classfield : functiondef, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (isTS && type == "(") return pass(functiondecl, classBody)
    if (type == ";" || type == ",") return cont(classBody);
    if (type == "}") return cont();
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    if (value == "=") return cont(expressionNoComma)
    var context = cx.state.lexical.prev, isInterface = context && context.info == "interface"
    return pass(isInterface ? functiondecl : functiondef)
  }
  function afterExport(type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    if (type == "(") return pass(expression);
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(commasep(expressionNoComma, "]"));
  }
  function enumdef() {
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && new Context(null, null, false),
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    blockCommentContinue: jsonMode ? null : " * ",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,

    skipExpression: function(state) {
      var top = state.cc[state.cc.length - 1]
      if (top == expression || top == expressionNoComma) state.cc.pop()
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE


define('skylark-codemirror/mode/htmlmixed/htmlmixed',[
  "../../CodeMirror",
  "../xml/xml",
  "../javascript/javascript",
  "../css/css"
], function(CodeMirror) {

  "use strict";

  var defaultTags = {
    script: [
      ["lang", /(javascript|babel)/i, "javascript"],
      ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
      ["type", /./, "text/plain"],
      [null, null, "javascript"]
    ],
    style:  [
      ["lang", /^css$/i, "css"],
      ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
      ["type", /./, "text/plain"],
      [null, null, "css"]
    ]
  };

  function maybeBackup(stream, pat, style) {
    var cur = stream.current(), close = cur.search(pat);
    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur);
    }
    return style;
  }

  var attrRegexpCache = {};
  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(text, attr) {
    var match = text.match(getAttrRegexp(attr))
    return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, tagText) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var tags = {};
    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
    addTags(defaultTags, tags);
    if (configTags) addTags(configTags, tags);
    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
      tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

    function html(stream, state) {
      var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName
      if (tag && !/[<>\s\/]/.test(stream.current()) &&
          (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
          tags.hasOwnProperty(tagName)) {
        state.inTag = tagName + " "
      } else if (state.inTag && tag && />$/.test(stream.current())) {
        var inTag = /^([\S]+) (.*)/.exec(state.inTag)
        state.inTag = null
        var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2])
        var mode = CodeMirror.getMode(config, modeSpec)
        var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
        state.token = function (stream, state) {
          if (stream.match(endTagA, false)) {
            state.token = html;
            state.localState = state.localMode = null;
            return null;
          }
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };
        state.localMode = mode;
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, "", ""));
      } else if (state.inTag) {
        state.inTag += stream.current()
        if (stream.eol()) state.inTag += " "
      }
      return style;
    };

    return {
      startState: function () {
        var state = CodeMirror.startState(htmlMode);
        return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {token: state.token, inTag: state.inTag,
                localMode: state.localMode, localState: local,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter, line) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter, line);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter, line);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
      }
    };
  }, "xml", "javascript", "css");

  CodeMirror.defineMIME("text/html", "htmlmixed");
});

define('skylark-widgets-wordpad/addons/actions/HtmlAction',[
  "skylark-domx-query",
  "skylark-codemirror/CodeMirror",
  "../../addons",
  "../../Action",
//  "skylark-codemirror/addon/fold/foldcode",
//  "skylark-codemirror/addon/fold/foldgutter",
//  "skylark-codemirror/addon/fold/brace-fold",
//  "skylark-codemirror/addon/fold/xml-fold",
//  "skylark-codemirror/addon/fold/indent-fold",
//  "skylark-codemirror/addon/fold/markdown-fold",
//  "skylark-codemirror/addon/fold/comment-fold",  
  "skylark-parsers-html",
  "skylark-codemirror/addon/beautify/beautify",  
  "skylark-codemirror/mode/xml/xml",
  "skylark-codemirror/mode/css/css",
  "skylark-codemirror/mode/javascript/javascript",
  "skylark-codemirror/mode/htmlmixed/htmlmixed"
],function($,CodeMirror,addons,Action,html){ 
   var  hasProp = {}.hasOwnProperty,
        slice = [].slice;
  

   var HtmlAction = Action.inherit({
    name : 'html',

    icon : 'html',

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
      var action, i, len, ref,
          self = this;
      this.editor.blur();
      this.editor.el.toggleClass('wordpad-html');
      this.editor.htmlMode = this.editor.el.hasClass('wordpad-html');
      if (this.editor.htmlMode) {
        this.editor.hidePopover();
        //this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val()));
        var  codemirrorOptions =  { 
          mode: 'htmlmixed', 
          lineWrapping: true, 
          dragDrop: false, 
          autoCloseTags: true, 
          matchTags: true, 
          autoCloseBrackets: true, 
          matchBrackets: true, 
          indentUnit: 4, 
          indentWithTabs: false, 
          tabSize: 4, 
          hintOptions: {
              completionSingle:
              false
          },
          beautify : {
            html : {
              beautifyFunc: html.beautify
            }
          },
          
  //        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
  //        foldGutter: true,
  //        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineNumbers: true
  
        };
       this.editor.sync(); 
       if (!this.CodeMirrorEditor) {
         this.CodeMirrorEditor = CodeMirror.fromTextArea(this.editor.textarea[0], codemirrorOptions);
         this.CodeMirrorEditor.on("blur",function(){
           self.editor.setValue(self.CodeMirrorEditor.getValue());
         })
       } else {
         this.CodeMirrorEditor.setValue(this.editor.textarea.val());
         this.CodeMirrorEditor.beautify();
       }
       //this._resizeTextarea();

      } else {
        this.editor.setValue(this.CodeMirrorEditor.getValue());
        //this.editor.setValue(this.editor.textarea.val());
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
    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\"\n      title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"fa fa-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\"\n      title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"fa fa-undo\"></span>\n    </a>\n  </div>\n</div>";
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
        _this.action.editor.editable.selection.setRangeAfter(_this.target, range);
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
          return _this.action.editor.editable.selection.setRangeAfter($img, range);
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
          _this.action.editor.editable.selection.setRangeAfter(_this.target, range);
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

    var _this = this;
    $uploadBtn.picker({
      title: _this._t('uploadImage'),
      multiple: true,
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
      picked : function(files){
        _this.editor.uploader.upload(files, {
          inline: true,
          img: _this.target
        });
      }      

    });
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
    return this.action.loadImage(this.target, src, (function(_this) {
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
  "skylark-storages-diskfs/readImage",  
  "../../addons",
  "../../Action",
  "./ImagePopover",
  "../../i18n"
],function(langx, $, readImage, addons,Action,ImagePopover,i18n){ 
   var ImageAction = Action.inherit({
      name : 'image',

      icon : 'image',

      htmlTag : 'img',

      disableTag : 'pre, table',

      placeholderImage : '',

      needFocus : false,

      _init : function() {
        Action.prototype._init.call(this);

        var item, k, len, ref;
        if (this.editor.options.imageAction) {
          if (Array.isArray(this.editor.options.imageAction)) {
            this.menu = [];
            ref = this.editor.options.imageAction;
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
        this.placeholderImage = this.editor.options.addons.actions.image.placeholderImage;
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

        this.popover = new ImagePopover({
          action: this
        });

        if (this.editor.options.upload) {
          return this._initUploader();
        }


      },

      _initUploader : function($uploadItem) {

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
            return readImage(file.obj).then(function(img) {
              var src;
              if (!$img.hasClass('uploading')) {
                return;
              }
              src = img ? img.src : _this.placeholderImage;
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
            try {
                if (typeof result !== 'object') {
                   result = JSON.parse(result);
                }
                if (_this.editor.options.upload.uploadedImagePath) {
                	img_path = _this.editor.options.upload.uploadedImagePath(result);
                } else {
	                img_path = result.files[0].url;
                }
            } catch (_error) {
                e = _error;
                result = {
                  success: false
                };
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
            _this.loadImage($img, _this.placeholderImage, function() {
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
              _this.popover.srcEl.val(_this.placeholderImage);
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
            _this.editor.trigger('valuechanged');
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
        return this.loadImage($img, src || this.placeholderImage, (function(_this) {
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
        hotkey = this.editor.options.tabIndent === false ? '' : ' (Tab)';
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
      tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkText')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\"\n      tabindex=\"-1\">\n      <span class=\"fa fa-unlink\"></span>\n    </a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkTarget')) + "</label>\n    <select class=\"link-target\">\n      <option value=\"_blank\">" + (this._t('openLinkInNewWindow')) + " (_blank)</option>\n      <option value=\"_self\">" + (this._t('openLinkInCurrentWindow')) + " (_self)</option>\n    </select>\n  </div>\n</div>";
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

    icon : 'listol',

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
      hotkey = this.editor.options.tabIndent === false ? '' : ' (Shift + Tab)';
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
        th: ['rowspan', 'colspan'],
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

    icon : "header",

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

      icon : 'listul',

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
define('skylark-widgets-wordpad/addons/actions/VideoPopover',[
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  var VideoPopover = Popover.inherit({
    offset : {
      top: 6,
      left: -4
    },

    _loadVideo : function(videoData, callback) {
      if (videoData && this.target.attr('src') === videoData.src) {
        return;
      }
      return $('.insertVideoBtn').data('videowrap') && this.action.loadVideo($('.insertVideoBtn').data('videowrap'), videoData, (function(_this) {
        return function(img) {
          if (!img) {

          }
        };
      })(this));
    },

    render : function() {
      var tpl;
      tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field video-embed-code\">\n    <label>" + (this._t('video')) + "</label>\n    <textarea placeholder=\"" + (this._t('videoPlaceholder')) + "\" type=\"text\" class=\"video-link\" ></textarea>\n  </div><br>\n  <div class=\"settings-field\">\n    <label>" + (this._t('videoSize')) + "</label>\n    <input class=\"image-size video-size\" id=\"video-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size video-size\" id=\"video-height\" type=\"text\" tabindex=\"3\" />\n  </div>\n  <div class=\"video-upload\">\n    <button class=\"btn insertVideoBtn\">" + (this._t('uploadVideoBtn')) + "</div>\n  </div>\n</div>";
      this.el.addClass('video-popover').append(tpl);
      this.srcEl = this.el.find('.video-link');
      this.widthEl = this.el.find('#video-width');
      this.heightEl = this.el.find('#video-height');
      this.el.find('.video-size').on('keydown', (function(_this) {
        return function(e) {
          if (e.which === 13 || e.which === 27) {
            e.preventDefault();
            return $('.insertVideoBtn').click();
          }
        };
      })(this));

      this.srcEl.on('keydown', (function(_this) {
        return function(e) {
          if (e.which === 13 || e.which === 27) {
            e.preventDefault();
            return $('.insertVideoBtn').click();
          }
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
      var $video, $videoWrap, args, videoData;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      $video = arguments[0] || this.target;
      this.width = $video.attr('data-width') || $video.width();
      this.height = $video.attr('data-height') || $video.height();
      if ($video.attr('data-link')) {
        videoData = {
          link: $video.attr('data-link'),
          tag: $video.attr('data-tag'),
          width: this.width,
          height: this.height
        };
        this.src = videoData.link;
      }
      this.widthEl.val(this.width);
      this.heightEl.val(this.height);
      this.srcEl.val(this.src);
      $('.insertVideoBtn').data('videowrap', $video);
      return $videoWrap = this.target;
    }
  });

  return VideoPopover;
});
define('skylark-widgets-wordpad/addons/actions/VideoAction',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./VideoPopover"
],function(langx,$,addons,Action,VideoPopover){ 
   var reUrlYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,
      reUrlVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;

   var VideoAction = Action.inherit({
      name : 'video',

      icon : 'video',

      htmlTag : 'embed, iframe',

      disableTag : 'pre, table, div',

      videoPlaceholder : 'video',

      videoContainerClass : 'video-container',

      placeholderPoster : '',

      needFocus : true,

      _init : function() {
        this.title = this._t(this.name);
        langx.merge(this.editor.editable.formatter._allowedTags, ['embed', 'iframe', 'video']);
        langx.extend(this.editor.editable.formatter._allowedAttributes, {
          embed: ['class', 'width', 'height', 'style','type', 'pluginspage', 'src', 'wmode', 'play', 'loop', 'menu', 'allowscriptaccess', 'allowfullscreen'],
          iframe: ['class', 'width', 'height','style', 'src', 'frameborder','data-link','data-width','data-height'],
          video: ['class', 'width', 'height', 'style','poster', 'controls', 'allowfullscreen', 'src', 'data-link', 'data-tag']
        });

        this.placeholderPoster =  this.editor.options.addons.actions.video.placeholderPoster;


        $(document).on('click', '.insertVideoBtn', (function(_this) {
          return function(e) {
            var videoData;
            videoData = {
              link: $('.video-link').val(),
              width: $('#video-width').val() || 100,
              height: $('#video-height').val() || 100
            };
            $('.video-link').val('');
            $('#video-width').val('');
            $('#video-height').val('');
            return _this._insert($('.insertVideoBtn').data('videowrap'), videoData, function() {
              return _this.editor.trigger('valuechanged');
            });
          };
        })(this));

        this.editor.body.on('click', '.wordpad-video-wrapper', (function(_this) {
          return function(e) {
            var $video = $(e.currentTarget).find('.wordpad-video');//siblings('video').show();
            return _this.popover.show($video);
          };
        })(this));
        this.editor.body.on('mousedown', (function(_this) {
          return function() {
            var $videoWrap;
            $videoWrap = $('.insertVideoBtn').data('videowrap');
            if ($videoWrap && $videoWrap.html() === _this.videoPlaceholder) {
              $videoWrap.remove();
              $('.insertVideoBtn').data('videowrap', null);
            }
            return _this.popover.hide();
          };
        })(this));
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('.wordpad-video').each(function(i, video) {
              return _this.decorate($(video));
            });
          };
        })(this));
        this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('.wordpad-video').each(function(i, video) {
              return _this.undecorate($(video));
            });
          };
        })(this));

        this.popover = new VideoPopover({
          action: this
        });
        return Action.prototype._init.call(this);
      },


      decorate : function($video) {
        if ($video.parent('.wordpad-video-wrapper').length > 0) {
          return;
        }
        $video.wrap('<figure class="wordpad-video-wrapper"></figure>');
        return $video.parent();
      },

      undecorate : function($video) {
        if (!($video.parent('.wordpad-video-wrapper').length > 0)) {
          return;
        }
        return $video.parent().replaceWith($video);
      },

      _execute : function() {
        var $video = this._create();
        return this.popover.show($video);
      },

      _status : function() {
        return this._disableStatus();
      },

      _create : function() {
        var $video, range;
        if (!this.editor.editable.inputManager.focused) {
          this.editor.focus();
        }
        range = this.editor.editable.selection.range();
        if (range) {
          range.deleteContents();
          this.editor.editable.selection.range(range);
        }
        $video = $('<video/>').attr({
          'poster': this.placeholderPoster,
          'width': 225,
          'height': 225,
          'class' : 'wordpad-video'
        });
        range.insertNode($video[0]);
        this.editor.editable.selection.setRangeAfter($video, range);
        this.editor.trigger('valuechanged');
        this.decorate($video);
        return $video;
      },

      _insert : function($video, videoData, callback) {
        var e, originNode, realVideo, videoLink, videoTag;
        if (!videoData.link) {
          this._remove($video);
        } else {
          var data = videoData.link;
          if (!data.match(/<iframe|<video|<embed/gi)) {
            // parse if it is link on youtube & vimeo
            var iframeStart = '<iframe style="width: 500px; height: 281px;" src="',
              iframeEnd = '" frameborder="0" allowfullscreen></iframe>';

            if (data.match(reUrlYoutube))    {
              data = data.replace(reUrlYoutube, iframeStart + 'https://www.youtube.com/embed/$1' + iframeEnd);
            } else if (data.match(reUrlVimeo)) {
              data = data.replace(reUrlVimeo, iframeStart + 'https://player.vimeo.com/video/$2' + iframeEnd);
            }
          }
          var $video1 = $(data).style({
            width : videoData.width + "px",
            height : videoData.height + "px"
          }).attr({
            "width" : videoData.width + "px",
            "height" : videoData.height + "px",
            'class' : 'wordpad-video',
            "data-link" : videoData.link,
            "data-width" : videoData.width,
            "data-height" : videoData.height
          });
          
          $video.replaceWith($video1);
          $video = $video1;
        }
        this.editor.trigger('valuechanged');
        this.popover.hide();
        return callback($video);
      },

      _remove : function($video) {
        $video.parent().remove();
      }

   });


   addons.actions.video = VideoAction; 

   return VideoAction;

});
define('skylark-widgets-wordpad/addons/toolbar/items/AlignmentButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../../ToolButton",
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
      }, this.editor.options.addons.toolbar.items.emoji || {});
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
  "./addons/actions/VideoAction",

  "./addons/toolbar/items/AlignmentButton",
  "./addons/toolbar/items/ColorButton",
  "./addons/toolbar/items/EmojiButton",
  "./addons/toolbar/items/TableButton",
  "./addons/toolbar/items/TitleButton"
],function(Wordpad){
	
  return Wordpad;
});
define('skylark-widgets-wordpad', ['skylark-widgets-wordpad/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-wordpad.js.map
