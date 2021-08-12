define([
	"skylark-langx-ns"
],function(skylark){
	var keyboard = {};
	/**
	 * Function: isShiftDown
	 * 
	 * Returns true if the shift key is pressed for the given event.
	 */
	keyboard.isShiftDown = function (evt) {
		return (evt != null) ? evt.shiftKey : false;
	};

	/**
	 * Function: isAltDown
	 * 
	 * Returns true if the alt key is pressed for the given event.
	 */
	keyboard.isAltDown = function (evt) {
		return (evt != null) ? evt.altKey : false;
	};

	/**
	 * Function: isControlDown
	 * 
	 * Returns true if the control key is pressed for the given event.
	 */
	keyboard.isControlDown = function (evt) {
		return (evt != null) ? evt.ctrlKey : false;
	};

	/**
	 * Function: isMetaDown
	 * 
	 * Returns true if the meta key is pressed for the given event.
	 */
	keyboard.isMetaDown = function (evt){
		return (evt != null) ? evt.metaKey : false;
	};


	return skylark.attach("devices.keyboard",keyboard);	
});