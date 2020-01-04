define([
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
