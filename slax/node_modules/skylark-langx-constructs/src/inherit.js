define([
	"./constructs"
],function(constructs){

    function inherit(ctor,base) {
        ///var f = function() {};
        ///f.prototype = base.prototype;
        ///
        ///ctor.prototype = new f();

	    if ((typeof base !== "function") && base) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    ctor.prototype = Object.create(base && base.prototype, {
	      constructor: {
	        value: ctor,
	        writable: true,
	        configurable: true
	      }
	    });

	    if (base) {
	    	//tor.__proto__ = base;
	    	Object.setPrototypeOf(ctor, base);
	    } 
    }

    return constructs.inherit = inherit
});