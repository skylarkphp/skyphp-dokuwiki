/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-net-http/Xhr"],function(n,t){"use strict";function e(n,t,i,l,r){i[n](t,function(n,t,i,l,r){return function(t,s){t&&l.push(t),++n<i.length?e(n,s,i,l,r):r(l,s)}}.apply(this,arguments))}var i={html:"html",css:"css",js:"javascript",less:"less",styl:"stylus",coffee:"coffeescript"};return{fetch:function(n,e){t.get(n).then(function(n){e(null,n)},function(n){e(n)})},seq:function(n,t,i=function(){}){var l=[];if(!n.length)return i(l,t);e(0,t,n,l,i)},log:function(){console.log(arguments)},getMode:function(t="",e="",l={}){var r=n.mixin({},i,l);for(let n in r){let t=n.length;if(e.slice(-t++)==="."+n)return r[n]}for(let n in r)if(t===n)return r[n];return t}}});
//# sourceMappingURL=sourcemaps/util.js.map
