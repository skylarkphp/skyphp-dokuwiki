/**
 * skylark-domx-plugins-uploads - The file upload plugin library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
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
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-uploads/uploads',[
    "skylark-domx-plugins-base/plugins",
    "skylark-domx-files/dropzone",
    "skylark-domx-files/pastezone",
    "skylark-domx-files/picker"
], function(plugins) {

    var uploads = function() {
        return uploads;
    };

    return plugins.uploads = uploads;
});
define('skylark-langx-async/deferred',[
    "skylark-langx-arrays",
	"skylark-langx-funcs",
    "skylark-langx-objects"
],function(arrays,funcs,objects){
    "use strict";

    var slice = Array.prototype.slice,
        proxy = funcs.proxy,
        makeArray = arrays.makeArray,
        result = objects.result,
        mixin = objects.mixin;

    mixin(Promise.prototype,{
        always: function(handler) {
            //this.done(handler);
            //this.fail(handler);
            this.then(handler,handler);
            return this;
        },
        done : function() {
            for (var i = 0;i<arguments.length;i++) {
                this.then(arguments[i]);
            }
            return this;
        },
        fail : function(handler) { 
            //return mixin(Promise.prototype.catch.call(this,handler),added);
            //return this.then(null,handler);
            this.catch(handler);
            return this;
         }
    });


    var Deferred = function() {
        var self = this,
            p = this.promise = makePromise2(new Promise(function(resolve, reject) {
                self._resolve = resolve;
                self._reject = reject;
            }));

        //wrapPromise(p,self);

        //this[PGLISTENERS] = [];
        //this[PGNOTIFIES] = [];

        //this.resolve = Deferred.prototype.resolve.bind(this);
        //this.reject = Deferred.prototype.reject.bind(this);
        //this.progress = Deferred.prototype.progress.bind(this);

    };

   
    function makePromise2(promise) {
        // Don't modify any promise that has been already modified.
        if (promise.isResolved) return promise;

        // Set initial state
        var isPending = true;
        var isRejected = false;
        var isResolved = false;

        // Observe the promise, saving the fulfillment in a closure scope.
        var result = promise.then(
            function(v) {
                isResolved = true;
                isPending = false;
                return v; 
            }, 
            function(e) {
                isRejected = true;
                isPending = false;
                throw e; 
            }
        );

        result.isResolved = function() { return isResolved; };
        result.isPending = function() { return isPending; };
        result.isRejected = function() { return isRejected; };

        result.state = function() {
            if (isResolved) {
                return 'resolved';
            }
            if (isRejected) {
                return 'rejected';
            }
            return 'pending';
        };

        var notified = [],
            listeners = [];

          
        result.then = function(onResolved,onRejected,onProgress) {
            if (onProgress) {
                this.progress(onProgress);
            }
            return makePromise2(Promise.prototype.then.call(this,
                onResolved && function(args) {
                    if (args && args.__ctx__ !== undefined) {
                        return onResolved.apply(args.__ctx__,args);
                    } else {
                        return onResolved(args);
                    }
                },
                onRejected && function(args){
                    if (args && args.__ctx__ !== undefined) {
                        return onRejected.apply(args.__ctx__,args);
                    } else {
                        return onRejected(args);
                    }
                }
            ));
        };

        result.progress = function(handler) {
            notified.forEach(function (value) {
                handler(value);
            });
            listeners.push(handler);
            return this;
        };

        result.pipe = result.then;

        result.notify = function(value) {
            try {
                notified.push(value);

                return listeners.forEach(function (listener) {
                    return listener(value);
                });
            } catch (error) {
            this.reject(error);
            }
            return this;
        };

        return result;
    }

 
    Deferred.prototype.resolve = function(value) {
        var args = slice.call(arguments);
        return this.resolveWith(null,args);
    };

    Deferred.prototype.resolveWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._resolve(args);
        this._resolved = true;
        return this;
    };

    Deferred.prototype.notify = function(value) {
        var p = result(this,"promise");
        p.notify(value);
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        var args = slice.call(arguments);
        return this.rejectWith(null,args);
    };

    Deferred.prototype.rejectWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._reject(args);
        this._rejected = true;
        return this;
    };

    Deferred.prototype.isResolved = function() {
        var p = result(this,"promise");
        return p.isResolved();
    };

    Deferred.prototype.isRejected = function() {
        var p = result(this,"promise");
        return p.isRejected();
    };

    Deferred.prototype.state = function() {
        var p = result(this,"promise");
        return p.state();
    };

    Deferred.prototype.then = function(callback, errback, progback) {
        var p = result(this,"promise");
        return p.then(callback, errback, progback);
    };

    Deferred.prototype.progress = function(progback){
        var p = result(this,"promise");
        return p.progress(progback);
    };
   
    Deferred.prototype.catch = function(errback) {
        var p = result(this,"promise");
        return p.catch(errback);
    };


    Deferred.prototype.always  = function() {
        var p = result(this,"promise");
        p.always.apply(p,arguments);
        return this;
    };

    Deferred.prototype.done  = function() {
        var p = result(this,"promise");
        p.done.apply(p,arguments);
        return this;
    };

    Deferred.prototype.fail = function(errback) {
        var p = result(this,"promise");
        p.fail(errback);
        return this;
    };


    Deferred.all = function(array) {
        //return wrapPromise(Promise.all(array));
        var d = new Deferred();
        Promise.all(array).then(d.resolve.bind(d),d.reject.bind(d));
        return result(d,"promise");
    };

    Deferred.first = function(array) {
        return makePromise2(Promise.race(array));
    };


    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(proxy(deferred.resolve,deferred), proxy(deferred.reject,deferred), deferred.notify);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve.apply(d,arguments);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;


    Deferred.promise = function(callback) {
        var d = new Deferred();

        callback(d.resolve.bind(d),d.reject.bind(d),d.progress.bind(d));

        return d.promise;
    };

    return Deferred;
});
define('skylark-domx-plugins-uploads/single-uploader',[
	"skylark-langx-emitter",
	"skylark-langx-async/deferred",
    "skylark-domx-velm",
    "skylark-domx-plugins-base",
	"./uploads",
],function(
	Emitter, 
	Deferred, 
	elmx,
	plugins,
	uploads
) {
	//import ZipLoader from 'zip-loader';

	/**
	 * Watches an element for file drops, parses to create a filemap hierarchy,
	 * and emits the result.
	 */
	class SingleUploader extends plugins.Plugin {
		get klassName() {
	    	return "SingleUploader";
    	} 

    	get pluginName(){
      		return "lark.uploads.single";
    	} 

		get options () {
      		return {
	            selectors : {
	              picker   : ".file-picker",
	              dropzone : ".file-dropzone",
	              pastezone: ".file-pastezone",

	              startUploads: '.start-uploads',
	              cancelUploads: '.cancel-uploads',
	            }
	     	}
		}


	  /**
	   * @param  {Element} elm
	   * @param  [options] 
	   */
	  constructor (elm, options) {
	  	super(elm,options);

        this._velm = elmx(this._elm);

	  	this._initFileHandlers();

	}

    _initFileHandlers () {
        var self = this;

        var selectors = this.options.selectors,
        	dzSelector = selectors.dropzone,
        	pzSelector = selectors.pastezone,
        	pkSelector = selectors.picker;

        if (dzSelector) {
			this._velm.$(dzSelector).dropzone({
                dropped : function (files) {
                    self._addFile(files[0]);
                }
			});
        }


        if (pzSelector) {
            this._velm.$(pzSelector).pastezone({
                pasted : function (files) {
                    self._addFile(files[0]);
                }
            });                
        }

        if (pkSelector) {
            this._velm.$(pkSelector).picker({
                multiple: true,
                picked : function (files) {
                    self._addFile(files[0]);
                }
            });                
        }
    }

     _addFile(file) {
        this.emit('added', file);	  
     }


	  /**
	   * Destroys the instance.
	   */
	  destroy () {
	  }


	}

	return uploads.SingleUploader = SingleUploader;

});

 
define('skylark-net-http/upload',[
    "skylark-langx-types",
    "skylark-langx-objects",
    "skylark-langx-arrays",
    "skylark-langx-async/Deferred",
    "skylark-langx-emitter/Evented",    
    "./Xhr",
    "./http"
],function(types, objects, arrays, Deferred, Evented,Xhr, http){

    var blobSlice = Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice;


    /*
     *Class for uploading files using xhr.
     */
    var Upload = Evented.inherit({
        klassName : "Upload",

        _construct : function(options) {
            this._options = objects.mixin({
                debug: false,
                url: '/upload',
                headers : {

                },
                // maximum number of concurrent uploads
                maxConnections: 999,
                // To upload large files in smaller chunks, set the following option
                // to a preferred maximum chunk size. If set to 0, null or undefined,
                // or the browser does not support the required Blob API, files will
                // be uploaded as a whole.
                maxChunkSize: undefined,

                onProgress: function(id, fileName, loaded, total){
                },
                onComplete: function(id, fileName,result,status,xhr){
                },
                onCancel: function(id, fileName){
                },
                onFailure : function(id,fileName,e) {                    
                }
            },options);

            this._queue = [];
            // params for files in queue
            this._params = [];

            this._files = [];
            this._xhrs = [];

            // current loaded size in bytes for each file
            this._loaded = [];

        },

        /**
         * Adds file to the queue
         * Returns id to use with upload, cancel
         **/
        add: function(file){
            return this._files.push(file) - 1;
        },

        /**
         * Sends the file identified by id and additional query params to the server.
         */
        send: function(id, params){
            if (!this._files[id]) {
                // Already sended or canceled
                return ;
            }
            if (this._queue.indexOf(id)>-1) {
                // Already in the queue
                return;
            }
            var len = this._queue.push(id);

            var copy = objects.clone(params);

            this._params[id] = copy;

            // if too many active uploads, wait...
            if (len <= this._options.maxConnections){
                this._send(id, this._params[id]);
            }     
        },

        /**
         * Sends all files  and additional query params to the server.
         */
        sendAll: function(params){
           for( var id = 0; id <this._files.length; id++) {
                this.send(id,params);
            }
        },

        /**
         * Cancels file upload by id
         */
        cancel: function(id){
            this._cancel(id);
            this._dequeue(id);
        },

        /**
         * Cancells all uploads
         */
        cancelAll: function(){
            for (var i=0; i<this._queue.length; i++){
                this._cancel(this._queue[i]);
            }
            this._queue = [];
        },

        getName: function(id){
            var file = this._files[id];
            return file.fileName != null ? file.fileName : file.name;
        },

        getSize: function(id){
            var file = this._files[id];
            return file.fileSize != null ? file.fileSize : file.size;
        },

        /**
         * Returns uploaded bytes for file identified by id
         */
        getLoaded: function(id){
            return this._loaded[id] || 0;
        },


        /**
         * Sends the file identified by id and additional query params to the server
         * @param {Object} params name-value string pairs
         */
        _send: function(id, params){
            var options = this._options,
                name = this.getName(id),
                size = this.getSize(id),
                chunkSize = options.maxChunkSize || 0,
                curUploadingSize,
                curLoadedSize = 0,
                file = this._files[id],
                args = {
                    headers : objects.clone(options.headers)                    
                };

            this._loaded[id] = this._loaded[id] || 0;

            var xhr = this._xhrs[id] = new Xhr({
                url : options.url
            });

            if (chunkSize)  {

                args.data = blobSlice.call(
                    file,
                    this._loaded[id],
                    this._loaded[id] + chunkSize,
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                curUploadingSize = args.data.size;
                // Expose the chunk bytes position range:
                args.headers["content-range"] = 'bytes ' + this._loaded[id] + '-' +
                    (this._loaded[id] + curUploadingSize - 1) + '/' + size;
                args.headers["Content-Type"] = "application/octet-stream";
            }  else {
                curUploadingSize = size;
                var formParamName =  params.formParamName,
                    formData = params.formData;

                if (formParamName) {
                    if (!formData) {
                        formData = new FormData();
                    }
                    formData.append(formParamName,file);
                    args.data = formData;
    
                } else {
                    args.headers["Content-Type"] = file.type || "application/octet-stream";
                    args.data = file;
                }
            }


            var self = this;
            xhr.post(
                args
            ).progress(function(e){
                if (e.lengthComputable){
                    curLoadedSize = curLoadedSize + e.loaded;
                    self._loaded[id] = self._loaded[id] + e.loaded;
                    self._options.onProgress(id, name, self._loaded[id], size);
                }
            }).then(function(result,status,xhr){
                if (!self._files[id]) {
                    // the request was aborted/cancelled
                    return;
                }

                if (curLoadedSize < curUploadingSize) {
                    // Create a progress event if no final progress event
                    // with loaded equaling total has been triggered
                    // for this chunk:
                    self._loaded[id] = self._loaded[id] + curUploadingSize - curLoadedSize;
                    self._options.onProgress(id, name, self._loaded[id], size);                    
                }

                if (self._loaded[id] <size) {
                    // File upload not yet complete,
                    // continue with the next chunk:
                    self._send(id,params);
                } else {
                    self._options.onComplete(id,name,result,status,xhr);

                    self._files[id] = null;
                    self._xhrs[id] = null;
                    self._dequeue(id);
                }


            }).catch(function(e){
                self._options.onFailure(id,name,e);

                self._files[id] = null;
                self._xhrs[id] = null;
                self._dequeue(id);
            });
        },

        _cancel: function(id){
            this._options.onCancel(id, this.getName(id));

            this._files[id] = null;

            if (this._xhrs[id]){
                this._xhrs[id].abort();
                this._xhrs[id] = null;
            }
        },

        /**
         * Returns id of files being uploaded or
         * waiting for their turn
         */
        getQueue: function(){
            return this._queue;
        },


        /**
         * Removes element from queue, starts upload of next
         */
        _dequeue: function(id){
            var i = arrays.inArray(id,this._queue);
            this._queue.splice(i, 1);

            var max = this._options.maxConnections;

            if (this._queue.length >= max && i < max){
                var nextId = this._queue[max-1];
                this._send(nextId, this._params[nextId]);
            }
        }
    });


  Upload.send = function(file, options) {
    var uploader = new Upload(options);
    var id = uploader.add(file);
    return uploader.send(id,options);
  };

  Upload.sendAll = function(files,options) {
      var uploader = new Upload(options);
      for (var i = 0, len = files.length; i < len; i++) {
        this.add(file[i]);
      }
      return uploader.send(options);
  };

    return http.Upload = Upload;    
});
define('skylark-domx-plugins-uploads/multi-uploader',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-net-http/upload",
  "skylark-domx-plugins-base",
  "./uploads"
]  ,function(skylark,langx,$, elmx,FileUpload, plugins,uploads){

    var fileListTemplate = '<div class="lark-multiuploader">' + 
        '    <h3 class="popover-title">Upload files</h3>' + 
        '    <div class="popover-content container-fluid" class="file-list file-dropzone file-pastezone">' + 
        '        <div class="no-data"><em>Add files.</em></div>' + 
        '    </div>' + 
        '    <footer>' + 
        '        <button class="btn btn-warning pull-right btn-sm" id="cancel-uploads-button"><i class="icon-cancel"></i>Cancel uploads</button>' + 
        '        <span class="btn btn-success fileinput-button btn-sm" id="fileinput-button">' + 
        '            <i class="icon-plus"></i>' + 
        '            <span>Add files...</span>' + 
        '            <input id="fileupload" type="file" name="files[]" multiple="multiple">' + 
        '        </span>' + 
        '        <button class="btn btn-primary btn-sm" id="start-uploads-button"><i class="icon-start"></i>Start uploads</button>' + 
        '    </footer>' + 
        '</div>',
        fileItemTemplate = '<div class="file-item row">' +
        '   <div class="col-md-6"><span class="name"></span></div>' + 
        '   <div class="col-md-3">' +
        '    <span class="size"></span>' +
        '    <div class="progress hidden">' +
        '        <div class="progress-label"></div>' +
        '        <div class="bar"></div>' +
        '    </div>' +
        '    <span class="message hidden"></span>' +
        '   </div>' +
        '   <div class="col-md-3">' +
        '    <button class="btn btn-warning btn-xs cancel"><i class="icon-remove"></i>Cancel</button>' +
        '    <button class="btn btn-xs clear hidden">Clear</button>' +
        '   </div>' +
        '</div>';

    var MultiUploader =  plugins.Plugin.inherit({
        klassName : "MultiUploader",
        pluginName : "lark.uploads.multi",

        options: {
            uploadUrl: '/upload',

        	params: {
                formParamName : "file"
            },

    	    maxConnections: 3,
        	// validation
        	allowedExtensions: [],
        	sizeLimit: 0,
        	minSizeLimit: 0,

            autoUpload: false,
            selectors : {
              fileList : ".file-list",
              fileItem : ".file-item",
              nodata : ".file-list .no-data",

              picker   : ".file-picker",
              dropzone : ".file-dropzone",
              pastezone: ".file-pastezone",

              startUploads: '.start-uploads',
              cancelUploads: '.cancel-uploads',
            },

            template : fileListTemplate,

            dataType: 'json',

            fileItem : {
            	selectors : {
                    name : ".name",
                    size : ".size",
                    cancel: ".cancel",
                    clear : ".clear",
                    progress : ".progress",
                    message : ".message"                   
            	},

            	template : fileItemTemplate
            }
        },


        _construct : function(elm,options) {
            var self = this;


            // Render current files
            /*
            this.files.forEach(function (file) {
                self.renderFile(file);
            });
            */

            //this._refresh({files:true});
        

            //this._files.on('all', function(){
            //  self._refresh({files:true});
            //});


           this.overrided(elm,options);


           this._velm = elmx(this._elm);
        


            this._initEventHandler();
            this._initFileHandlers();
            this._initUpoadHandler();
            this._updateFileList();
        },

        _initFileHandlers : function() {
            var self = this;

            var selectors = this.options.selectors,
            	dzSelector = selectors.dropzone,
            	pzSelector = selectors.pastezone,
            	pkSelector = selectors.picker;

            if (dzSelector) {
				this._velm.$(dzSelector).dropzone({
	                dropped : function (files) {
                        self._addFiles(files);
	                }
				});
            }


            if (pzSelector) {
                this._velm.$(pzSelector).pastezone({
                    pasted : function (files) {
                        self._addFiles(files);
                    }
                });                
            }

            if (pkSelector) {
                this._velm.$(pkSelector).picker({
                    multiple: true,
                    picked : function (files) {
                        self._addFiles(files);
                    }
                });                
            }
        },

        _initUpoadHandler: function(){
            var self = this,
                handlerClass;

            this._handler = new FileUpload({
                url: this.options.uploadUrl,
                maxConnections: this.options.maxConnections,
                onProgress: function(id, fileName, loaded, total){
                    self._onProgress(id, fileName, loaded, total);
                },
                onComplete: function(id, fileName, result){
                    self._onComplete(id, fileName, result);
                },
                onCancel: function(id, fileName){
                    self._onCancel(id, fileName);
                },
                onFailure: function(id,fileName,e){
                    self._onFailure(id,fileName,e);
                }
            });
        },
        
         /**
         * delegate click event for cancel link
         **/
        _initEventHandler: function(){
            var self = this,
               selectors = this.options.selectors,
               itemSelectors = this.options.fileItem.selectors, 
               list = this._listElement;

            // Add cancel handler
            this._velm.$(selectors.fileList).on("click",itemSelectors.cancel,function(e){
                var $fileItem = $(this).closest(selectors.fileItem),
                    fileId = $fileItem.data("fileId");
                self._handler.cancel(fileId);
                $fileItem.remove();
                self._updateFileList();
            });

            // Add clear handler
            this._velm.$(selectors.fileList).on("click",itemSelectors.clear,function(e){
                var $fileItem = $(this).closest(selectors.fileItem),
                    fileId = $fileItem.data("fileId");
                $fileItem.remove();
                self._updateFileList();
            });

            // Add cancel all handler
            this._velm.$(selectors.cancelUploads).click(function(){
                var $files = self._velm.$(selectors.fileList).find(selectors.fileItem);           
                $files.forEach(function(fileItem){
                    var $fileItem = $(fileItem),
                        fileId = $fileItem.data("fileId");
                    self._handler.cancel(fileId);
                    $fileItem.remove();
                });
                self._updateFileList();

            });

            // Add start uploads handler
            this._velm.$(selectors.startUploads).click(function(){
                var $files = self._velm.$(selectors.fileList).find(selectors.fileItem);           
                $files.forEach(function(fileItem){
                    var $fileItem = $(fileItem),
                        fileId = $fileItem.data("fileId");
                    if (!$fileItem.data("status")) {
                        // The file has not yet been sent
                        self._handler.send(fileId,self.options.params);
                    }
                });

            });
            

        },       

        _onProgress: function(id, fileName, loaded, total){          
            var $item = this._getItemByFileId(id);

            var percent = parseInt(loaded / total * 100, 10);
            var progressHTML = this._formatSize(loaded)+' of '+ this._formatSize(total);

            $item.data("status","running");
            $item.find('.progress')
                .find('.bar')
                .css('width', percent+'%')
                .parent()
                .find('.progress-label')
                .html(progressHTML);
            this._updateFile($item);

        },

        _onComplete: function(id, fileName, result){
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","done");
            $item.find('.message').html('<i class="icon-success"></i> ' + (this.doneMsg || 'Uploaded'));
            this._updateFile($item);
        },

        _onFailure : function(id,fileName,e) {
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","error");
            $item.find('.message').html('<i class="icon-error"></i> ');;
            this._updateFile($item)

        },

        _onCancel: function(id, fileName){
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","cancel");
            this._updateFile($item)
        },

        _addToList: function(id, fileName){
            var self = this;


            var fileName = this._handler.getName(id),
                fileSize = this._handler.getSize(id);

            var item = $(this.options.fileItem.template);
            item.data("fileId",id);

            item.find(this.options.fileItem.selectors.name).html(this._formatFileName(fileName));
            item.find(this.options.fileItem.selectors.size).html(this._formatSize(fileSize));

            this._velm.$(this.options.selectors.fileList).append(item);

            this._updateFileList();
        },
    
        _updateFileList : function ()  {
            var selectors = this.options.selectors,
                itemSelectors = this.options.fileItem.selectors,
                files = this._velm.$(selectors.fileList).find(selectors.fileItem);

            var with_files_elements = this._velm.$(selectors.cancelUploads + ',' + selectors.startUploads);
            var without_files_elements = this._velm.$(selectors.nodata);
            if (files.length > 0) {
                with_files_elements.removeClass('hidden');
                without_files_elements.addClass('hidden');
            } else {
                with_files_elements.addClass('hidden');
                without_files_elements.removeClass('hidden');
            }
        },
        
        _updateFile: function ($item) {
            var selectors = this.options.fileItem.selectors,
                when_pending = $item.find(selectors.size + "," + selectors.cancel),
                when_running = $item.find(selectors.progress + "," + selectors.cancel),
                when_done = $item.find(selectors.message + "," + selectors.clear);

            var status = $item.data("status");    
            if (status == "pending") {
                when_running.add(when_done).addClass('hidden');
                when_pending.removeClass('hidden');
            } else if (status == "running") {
                when_pending.add(when_done).addClass('hidden');
                when_running.removeClass('hidden');
            } else if (status == "done" || status == "error") {
                when_pending.add(when_running).addClass('hidden');
                when_done.removeClass('hidden');
            }
        },

        _getItemByFileId: function(id){
            var selectors = this.options.selectors,
                files = this._velm.$(selectors.fileList).find(selectors.fileItem),
                item;

            // there can't be txt nodes in dynamically created list
            // and we can  use nextSibling

            for (var i = 0; i<files.length;i++){
                var item2 = files[i];
                if ($(item2).data("fileId") == id) {
                    item = item2;
                    break;
                }
            }
            if (item) {
                return $(item);
            }
        },


            
        _addFiles: function(files){
            for (var i=0; i<files.length; i++){
                if ( !this._validateFile(files[i])){
                    return;
                }
            }

            for (var i=0; i<files.length; i++){
                this._addFile(files[i]);
            }
        },

        _addFile: function(file){
            var id = this._handler.add(file);

            this._filesInProgress++;
            this._addToList(id);

            //this._handler.upload(id, this.options.params);
        },

        _validateFile: function(file){
            var name, size;

            if (file.value){
                // it is a file input
                // get input value and remove path to normalize
                name = file.value.replace(/.*(\/|\\)/, "");
            } else {
                // fix missing properties in Safari
                name = file.fileName != null ? file.fileName : file.name;
                size = file.fileSize != null ? file.fileSize : file.size;
            }

            if (! this._isAllowedExtension(name)){
                this._error('typeError', name);
                return false;

            } else if (size === 0){
                this._error('emptyError', name);
                return false;

            } else if (size && this.options.sizeLimit && size > this.options.sizeLimit){
                this._error('sizeError', name);
                return false;

            } else if (size && size < this.options.minSizeLimit){
                this._error('minSizeError', name);
                return false;
            }

            return true;
        },

        _error: function(code, fileName){
            var message = this.options.messages[code];
            function r(name, replacement){ message = message.replace(name, replacement); }

            r('{file}', this._formatFileName(fileName));
            r('{extensions}', this.options.allowedExtensions.join(', '));
            r('{sizeLimit}', this._formatSize(this.options.sizeLimit));
            r('{minSizeLimit}', this._formatSize(this.options.minSizeLimit));

            this.options.showMessage(message);
        },

        _formatFileName: function(name){
            if (name.length > 33){
                name = name.slice(0, 19) + '...' + name.slice(-13);
            }
            return name;
        },

        _isAllowedExtension: function(fileName){
            var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
            var allowed = this.options.allowedExtensions;

            if (!allowed.length){return true;}

            for (var i=0; i<allowed.length; i++){
                if (allowed[i].toLowerCase() == ext){ return true;}
            }

            return false;
        },

        _formatSize: function(bytes){
            var i = -1;
            do {
                bytes = bytes / 1024;
                i++;
            } while (bytes > 99);

            return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
        }

    });

   plugins.register(MultiUploader);



	return uploads.MultiUploader = MultiUploader;
});
define('skylark-domx-plugins-uploads/main',[
	"./uploads",
	"./single-uploader",
	"./multi-uploader"
],function(uploads){
	return uploads;
});
define('skylark-domx-plugins-uploads', ['skylark-domx-plugins-uploads/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-uploads.js.map
