/**
 * skylark-visibility - A version of visibility.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-visibility/
 * @license MIT
 */
define([],function(){if(!document.visibilityState&&!document.webkitVisibilityState){document.hidden=!1,document.visibilityState="visible";var t=null,i=function(){document.createEvent?(t||(t=document.createEvent("HTMLEvents")).initEvent("visibilitychange",!0,!0),document.dispatchEvent(t)):"object"==typeof Visibility&&Visibility._change.call(Visibility,{})},e=function(){document.hidden=!1,document.visibilityState="visible",i()},n=function(){document.hidden=!0,document.visibilityState="hidden",i()};document.addEventListener?(window.addEventListener("focus",e,!0),window.addEventListener("blur",n,!0)):(document.attachEvent("onfocusin",e),document.attachEvent("onfocusout",n))}});
//# sourceMappingURL=sourcemaps/fallback.js.map
