define([
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