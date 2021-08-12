/**
 * skylark-langx-topic - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(r,n){var t=n.define,require=n.require,e="function"==typeof t&&t.amd,o=!e&&"undefined"!=typeof exports;if(!e&&!t){var i={};t=n.define=function(r,n,t){"function"==typeof t?(i[r]={factory:t,deps:n.map(function(n){return function(r,n){if("."!==r[0])return r;var t=n.split("/"),e=r.split("/");t.pop();for(var o=0;o<e.length;o++)"."!=e[o]&&(".."==e[o]?t.pop():t.push(e[o]));return t.join("/")}(n,r)}),resolved:!1,exports:null},require(r)):i[r]={factory:null,resolved:!0,exports:t}},require=n.require=function(r){if(!i.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var module=i[r];if(!module.resolved){var t=[];module.deps.forEach(function(r){t.push(require(r))}),module.exports=module.factory.apply(n,t)||null,module.resolved=!0}return module.exports}}if(!t)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,require){r("skylark-langx-topic/topic",["skylark-langx-ns","skylark-langx-events"],function(r,n){var t=new n.Emitter;return r.attach("langx.topic",{publish:function(r,n,e){var o=[].slice.call(arguments,1);return t.trigger({type:r,data:o})},subscribe:function(r,n,e){var o=function(r){n.apply(e,r.data)};return t.on(r,o),{remove:function(){t.off(r,o)}}}})}),r("skylark-langx-topic/main",["./topic"],function(r){return r}),r("skylark-langx-topic",["skylark-langx-topic/main"],function(r){return r})}(t),!e){var a=require("skylark-langx-ns");o?module.exports=a:n.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-topic.js.map
