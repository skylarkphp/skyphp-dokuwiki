/**
 * skylark-visibility - A version of visibility.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-visibility/
 * @license MIT
 */
define(["./fallback"],function(){if(window.Visibility)return window.Visibility;var i=-1,n={onVisible:function(i){var e=n.isSupported();if(!e||!n.hidden())return i(),e;var t=n.change(function(e,r){n.hidden()||(n.unbind(t),i())});return t},change:function(e){if(!n.isSupported())return!1;var t=i+=1;return n._callbacks[t]=e,n._listen(),t},unbind:function(i){delete n._callbacks[i]},afterPrerendering:function(i){var e=n.isSupported();if(!e||"prerender"!=n.state())return i(),e;var t=n.change(function(e,r){"prerender"!=r&&(n.unbind(t),i())});return t},hidden:function(){return!(!n._doc.hidden&&!n._doc.webkitHidden)},state:function(){return n._doc.visibilityState||n._doc.webkitVisibilityState||"visible"},isSupported:function(){return void 0!==n._doc.hidden||void 0!==n._doc.webkitHidden},_doc:document||{},_callbacks:{},_change:function(i){var e=n.state();for(var t in n._callbacks)n._callbacks[t].call(n._doc,i,e)},_listen:function(){if(!n._init){var i="visibilitychange";n._doc.webkitVisibilityState&&(i="webkit"+i);var e=function(){n._change.apply(n,arguments)};n._doc.addEventListener?n._doc.addEventListener(i,e):n._doc.attachEvent(i,e),n._init=!0}}};return window.Visibility=n});
//# sourceMappingURL=sourcemaps/core.js.map
