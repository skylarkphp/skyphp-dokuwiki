/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
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

define('skylark-io-diskfs/diskfs',[
    "skylark-langx/skylark"
], function(skylark) {

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }


    var diskfs = function() {
        return diskfs;
    };

    return skylark.attach("storages.diskfs", diskfs);
});
define('skylark-io-diskfs/download',[
    "skylark-langx/types",
    "./diskfs"
],function(types,diskfs){

    function downloadFile(data, name) {
        if (window.navigator.msSaveBlob) {
            if (types.isString(data)) {
                data = dataURItoBlob(data);
            }
            window.navigator.msSaveBlob(data, name);
        } else {
            var a = document.createElement('a');
            if (data instanceof Blob) {
                data = URL.createObjectURL(data);
            }
            a.href = data;
            a.setAttribute('download', name || 'noname');
            //a.dispatchEvent(new CustomEvent('click'));
            a.click();
        }
    }

    return diskfs.downlad = downloadFile;

});

define('skylark-io-diskfs/read',[
    "skylark-langx-async/Deferred",
    "./diskfs"
],function(Deferred, diskfs){

    function readFile(file, params) {
        params = params || {};
        var d = new Deferred,
            reader = new FileReader();

        reader.onload = function(evt) {
            d.resolve(evt.target.result);
        };
        reader.onerror = function(e) {
            var code = e.target.error.code;
            if (code === 2) {
                alert('please don\'t open this page using protocol fill:///');
            } else {
                alert('error code: ' + code);
            }
        };

        if (params.asArrayBuffer) {
            reader.readAsArrayBuffer(file);
        } else if (params.asDataUrl) {
            reader.readAsDataURL(file);
        } else if (params.asText) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }

        return d.promise;
    }

    return diskfs.read = diskfs.readFile = readFile;
    
});

define('skylark-io-diskfs/readImage',[
    "skylark-langx/Deferred",
    "./diskfs",
    "./read"
],function(Deferred, diskfs,read){

	function readImage(fileObj) {
        var d = new Deferred,
	    	img = new Image();

	    img.onload = function() {
	      d.resolve(img);
	    };
	    img.onerror = function(e) {
	      d.reject(e);
	    };

	    read(fileObj,{
	    	asDataUrl : true
	    }).then(function(dataUrl){
	        img.src = dataUrl;
	    }).catch(function(e){
	    	d.reject(e);
	    });

	    return d.promise;
	}

	return diskfs.readImage = readImage;

});
define('skylark-io-diskfs/select',[
    "./diskfs"
],function(diskfs){
    var fileInput,
        fileInputForm,
        fileSelected,
        maxFileSize = 1 / 0;

    function select(params) {
        params = params || {};
        var directory = params.directory || false,
            multiple = params.multiple || false,
            accept = params.accept || "", //'image/gif,image/jpeg,image/jpg,image/png,image/svg'
            title = params.title || "",
            fileSelected = params.picked;
        if (!fileInput) {
            var input = fileInput = document.createElement("input");

            input.type = "file";
            input.style.position = "fixed";
            input.style.left = 0;
            input.style.top = 0;
            input.style.opacity = .001;
            document.body.appendChild(input);

        }

        function selectFiles(pickedFiles) {
            for (var i = pickedFiles.length; i--;) {
                if (pickedFiles[i].size > maxFileSize) {
                    pickedFiles.splice(i, 1);
                }
            }
            fileSelected(pickedFiles);
        }

        fileInput.onchange = function(e) {
            var entries = e.target.webkitEntries || e.target.entries;

            if (entries && entries.length) {
                webentry.all(entries).then(function(files) {
                    selectFiles(files);
                });
            } else {
                selectFiles(Array.prototype.slice.call(e.target.files));
            }
            // reset to "", so selecting the same file next time still trigger the change handler
            fileInput.value = "";     
            fileInput.onchange = null;
        };
        
        fileInput.multiple = multiple;
        fileInput.accept = accept;
        fileInput.title = title;

        fileInput.webkitdirectory = directory;
        fileInput.click();
    }

    return diskfs.select = select;
});


 define('skylark-io-diskfs/webentry',[
    "skylark-langx/arrays",
    "skylark-langx/Deferred",
    "./diskfs"
],function(arrays,Deferred, diskfs){
    var concat = Array.prototype.concat;
    var webentry = (function() {
        function one(entry, path) {
            var d = new Deferred(),
                onError = function(e) {
                    d.reject(e);
                };

            path = path || '';
            if (entry.isFile) {
                entry.file(function(file) {
                    file.relativePath = path;
                    d.resolve(file);
                }, onError);
            } else if (entry.isDirectory) {
                var dirReader = entry.createReader();
                dirReader.readEntries(function(entries) {
                    all(
                        entries,
                        path + entry.name + '/'
                    ).then(function(files) {
                        d.resolve(files);
                    }).catch(onError);
                }, onError);
            } else {
                // Return an empy list for file system items
                // other than files or directories:
                d.resolve([]);
            }
            return d.promise;
        }

        function all(entries, path) {
            return Deferred.all(
                arrays.map(entries, function(entry) {
                    return one(entry, path);
                })
            ).then(function() {
                return concat.apply([], arguments);
            });
        }

        return {
            one: one,
            all: all
        };
    })();

    return diskfs.webentry = webentry;
});
define('skylark-io-diskfs/main',[
	"./diskfs",
	"./download",
	"./read",
	"./readImage",
	"./select",
	"./webentry"
],function(diskfs){
	return diskfs;
});
define('skylark-io-diskfs', ['skylark-io-diskfs/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-io-diskfs.js.map
