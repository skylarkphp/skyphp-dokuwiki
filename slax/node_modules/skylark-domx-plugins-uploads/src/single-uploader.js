define([
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

 