define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-io-diskfs/select",
  "skylark-io-diskfs/readImage",  
  "../../addons",
  "../../Action",
  "./ImagePopover",
  "../../i18n"
],function(langx, $, selectFile,readImage, addons,Action,ImagePopover,i18n){ 
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
                text: i18n.translate('uploadImage'),
                param: 'uploadImage'
              }, {
                name: 'external-image',
                text: i18n.translate('externalImage'),
                param : 'externalImage'
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
              return _this.popover.srcEl.val(img_path);
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

      _execute : function(menuItem) {
        var self = this;
        if (menuItem=="uploadImage") {
          selectFile({
            title: this._t('uploadImage'),
            multiple: true,
            accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            picked : function(files){
              self.editor.uploader.upload(files, {
                inline: true,
//                img: $img
              });
            }      

          });
        } else {
          var $img = this.createImage();
          return this.loadImage($img, this.placeholderImage, (function(_this) {
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
      }

   });

   addons.actions.image = ImageAction; 

   return ImageAction;

});