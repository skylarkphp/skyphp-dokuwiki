/**
 * skylark-devices-orientation - The orientation  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(e){return e.attach("devices.orientation",{isDeviceOrientationSupported:function(){return new Promise(function(e){if("DeviceOrientationEvent"in window){var n=function(i){i&&null!==i.alpha&&!isNaN(i.alpha)?e(!0):e(!1),window.removeEventListener("deviceorientation",n)};window.addEventListener("deviceorientation",n,!1),setTimeout(n,2e3)}else e(!1)})}})});
//# sourceMappingURL=sourcemaps/orientation.js.map
