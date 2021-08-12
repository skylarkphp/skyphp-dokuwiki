define([
	"skylark-domx-eventer",
	"skylark-domx-data",
	"skylark-domx-geom",
	"./iframes",
	"./load-real"
],function(eventer,datax,geom,iframes,loadReal){
	var pending;


  	function check() {
	    var i = 0;
	    var todo = [];
	    for (i = 0; i < pending.length; i++) {
	      if (geom.inview(pending[i], 400)) {
	        todo.unshift({ iframe: pending[i], i: i });
	      }
	    }

	    for (i = todo.length -1 ; i >=0 ; i--) {
	      pending.splice(todo[i].i, 1);
	      loadReal(todo[i].iframe);
	    }
  	}

	function init() {
		if (pending) {
			return
		}

		pending = [];

		eventer.on(window,"scroll",function(){
			check();
		});
	}

	function lazyLoad(iframe,options) {
		init();

		options = options || {};
	
      	///iframe.setAttribute('data-url', url);
      	///iframe.src = 'https://jsbin.com/embed-holding';
      	if (options.url) {
      		datax.attr(iframe,(options.urlAttrName || "data-url"),options.url)
      	}

      	if (options.holdingUrl) {
      		datax.prop(iframe,"src",options.holdingUrl)      		
      	}

		pending.push(iframe);
	}

	return iframes.lazyLoad = lazyLoad
});