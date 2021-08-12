define([
  "skylark-langx-ns"
],function(skylark){

  /**
   * @summary Detects if device orientation is supported
   * @description We can only be sure device orientation is supported once received an event with coherent data
   * @returns {Promise<boolean>}
   */
   function isDeviceOrientationSupported() {
    return new Promise(function(resolve) {
      if ('DeviceOrientationEvent' in window) {
        var listener = function(e) {
          if (e && e.alpha !== null && !isNaN(e.alpha)) {
            resolve(true);
          }
          else {
            resolve(false);
          }

          window.removeEventListener('deviceorientation', listener);
        };

        window.addEventListener('deviceorientation', listener, false);

        // after 2 secs, auto-reject the promise
        setTimeout(listener, 2000);
      }
      else {
        resolve(false);
      }
    });
  }

  return skylark.attach("devices.orientation",{
    isDeviceOrientationSupported
  });
	
});