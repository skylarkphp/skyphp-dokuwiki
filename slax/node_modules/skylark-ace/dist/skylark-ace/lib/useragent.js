/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,a){"use strict";if(e.OS={LINUX:"LINUX",MAC:"MAC",WINDOWS:"WINDOWS"},e.getOS=function(){return e.isMac?e.OS.MAC:e.isLinux?e.OS.LINUX:e.OS.WINDOWS},"object"==typeof navigator){var o=(navigator.platform.match(/mac|win|linux/i)||["other"])[0].toLowerCase(),t=navigator.userAgent;e.isWin="win"==o,e.isMac="mac"==o,e.isLinux="linux"==o,e.isIE="Microsoft Internet Explorer"==navigator.appName||navigator.appName.indexOf("MSAppHost")>=0?parseFloat((t.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]):parseFloat((t.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]),e.isOldIE=e.isIE&&e.isIE<9,e.isGecko=e.isMozilla=t.match(/ Gecko\/\d+/),e.isOpera=window.opera&&"[object Opera]"==Object.prototype.toString.call(window.opera),e.isWebKit=parseFloat(t.split("WebKit/")[1])||void 0,e.isChrome=parseFloat(t.split(" Chrome/")[1])||void 0,e.isEdge=parseFloat(t.split(" Edge/")[1])||void 0,e.isAIR=t.indexOf("AdobeAIR")>=0,e.isIPad=t.indexOf("iPad")>=0,e.isAndroid=t.indexOf("Android")>=0,e.isChromeOS=t.indexOf(" CrOS ")>=0,e.isIOS=/iPad|iPhone|iPod/.test(t)&&!window.MSStream,e.isIOS&&(e.isMac=!0),e.isMobile=e.isIPad||e.isAndroid}});
//# sourceMappingURL=../sourcemaps/lib/useragent.js.map
