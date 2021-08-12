define([
    "skylark-domx-eventer",	
	"./interact"
],function(
	eventer,
	interact
){
	
	function mouser(elm,options) {
		options = options || {};
		suffixName = options.suffixName || "noname";


		function mouseMove(e) {

		}

		function mouseUp(e) {

		}

		eventer.on(elm,"mousedown." + suffixName, function(e){

		});

	}

	

	return interact.mouser = mouser;
});