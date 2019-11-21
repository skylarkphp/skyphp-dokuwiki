define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button",
  "../i18n"
],function($,Toolbar,Wordpad,Button,i18n){ 

  
  var FullScrennButton = Button.inherit({
    name : 'fullscreen',

    needFocus : false,

    _init : function() {
      Button.prototype._init.call(this);

      this.window = $(window);
      this.body = $('body');
      this.editable = this.editor.body;
      return this.toolbar = this.toolbar.wrapper;
    }

  });



  FullScrennButton.cls = 'wordpad-fullscreen';

  FullScrennButton.i18n = {
    'zh-CN': {
      fullscreen: '全屏'
    }
  };

  FullScrennButton.prototype.iconClassOf = function() {
    return 'icon-fullscreen';
  };


  FullScrennButton.prototype.status = function() {
    return this.setActive(this.body.hasClass(this.constructor.cls));
  };

  FullScrennButton.prototype.command = function() {
    var editablePadding, isFullscreen;
    this.body.toggleClass(this.constructor.cls);
    isFullscreen = this.body.hasClass(this.constructor.cls);
    if (isFullscreen) {
      editablePadding = this.editable.outerHeight() - this.editable.height();
      this.window.on("resize.wordpad-fullscreen-" + this.editor.id, (function(_this) {
        return function() {
          return _this._resize({
            height: _this.window.height() - _this.toolbar.outerHeight() - editablePadding
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
  };

  FullScrennButton.prototype._resize = function(size) {
    return this.editable.height(size.height);
  };

  Wordpad.Toolbar.addButton(FullScrennButton);

  return FullScrennButton;

 }); 