/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";if(exports.OS={LINUX:"LINUX",MAC:"MAC",WINDOWS:"WINDOWS"},exports.getOS=function(){return exports.isMac?exports.OS.MAC:exports.isLinux?exports.OS.LINUX:exports.OS.WINDOWS},"object"==typeof navigator){var i=(navigator.platform.match(/mac|win|linux/i)||["other"])[0].toLowerCase(),e=navigator.userAgent;exports.isWin="win"==i,exports.isMac="mac"==i,exports.isLinux="linux"==i,exports.isIE="Microsoft Internet Explorer"==navigator.appName||navigator.appName.indexOf("MSAppHost")>=0?parseFloat((e.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]):parseFloat((e.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]),exports.isOldIE=exports.isIE&&exports.isIE<9,exports.isGecko=exports.isMozilla=e.match(/ Gecko\/\d+/),exports.isOpera=window.opera&&"[object Opera]"==Object.prototype.toString.call(window.opera),exports.isWebKit=parseFloat(e.split("WebKit/")[1])||void 0,exports.isChrome=parseFloat(e.split(" Chrome/")[1])||void 0,exports.isEdge=parseFloat(e.split(" Edge/")[1])||void 0,exports.isAIR=e.indexOf("AdobeAIR")>=0,exports.isIPad=e.indexOf("iPad")>=0,exports.isAndroid=e.indexOf("Android")>=0,exports.isChromeOS=e.indexOf(" CrOS ")>=0,exports.isIOS=/iPad|iPhone|iPod/.test(e)&&!window.MSStream,exports.isIOS&&(exports.isMac=!0),exports.isMobile=exports.isIPad||exports.isAndroid}});
//# sourceMappingURL=../sourcemaps/lib/useragent.js.map
