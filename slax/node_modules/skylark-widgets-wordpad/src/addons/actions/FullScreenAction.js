define([
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