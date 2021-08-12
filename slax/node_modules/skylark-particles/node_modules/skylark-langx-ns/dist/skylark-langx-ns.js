/**
 * skylark-langx-ns - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(n,r){var e=r.define,require=r.require,t="function"==typeof e&&e.amd,o=!t&&"undefined"!=typeof exports;if(!t&&!e){var s={};e=r.define=function(n,r,e){"function"==typeof e?(s[n]={factory:e,deps:r.map(function(r){return function(n,r){if("."!==n[0])return n;var e=r.split("/"),t=n.split("/");e.pop();for(var o=0;o<t.length;o++)"."!=t[o]&&(".."==t[o]?e.pop():e.push(t[o]));return e.join("/")}(r,n)}),resolved:!1,exports:null},require(n)):s[n]={factory:null,resolved:!0,exports:e}},require=r.require=function(n){if(!s.hasOwnProperty(n))throw new Error("Module "+n+" has not been defined");var module=s[n];if(!module.resolved){var e=[];module.deps.forEach(function(n){e.push(require(n))}),module.exports=module.factory.apply(r,e)||null,module.resolved=!0}return module.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(n,require){n("skylark-langx-ns/_attach",[],function(){return function(n,r,e){"string"==typeof r&&(r=r.split("."));for(var t=r.length,o=n,s=0,a=r[s++];s<t;)o=o[a]=o[a]||{},a=r[s++];if(o[a]){if(e)throw new Error("This namespace already exists:"+r)}else o[a]=e||{};return o[a]}}),n("skylark-langx-ns/ns",["./_attach"],function(n){var r={attach:function(e,t){return n(r,e,t)}};return r}),n("skylark-langx-ns/main",["./ns"],function(n){return n}),n("skylark-langx-ns",["skylark-langx-ns/main"],function(n){return n})}(e),!t){var a=require("skylark-langx-ns");o?module.exports=a:r.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-ns.js.map
