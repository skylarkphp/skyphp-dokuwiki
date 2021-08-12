/**
 * skylark-langx-chars - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(r,n){var e=n.define,require=n.require,t="function"==typeof e&&e.amd,a=!t&&"undefined"!=typeof exports;if(!t&&!e){var o={};e=n.define=function(r,n,e){"function"==typeof e?(o[r]={factory:e,deps:n.map(function(n){return function(r,n){if("."!==r[0])return r;var e=n.split("/"),t=r.split("/");e.pop();for(var a=0;a<t.length;a++)"."!=t[a]&&(".."==t[a]?e.pop():e.push(t[a]));return e.join("/")}(n,r)}),resolved:!1,exports:null},require(r)):o[r]={factory:null,resolved:!0,exports:e}},require=n.require=function(r){if(!o.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var module=o[r];if(!module.resolved){var e=[];module.deps.forEach(function(r){e.push(require(r))}),module.exports=module.factory.apply(n,e)||null,module.resolved=!0}return module.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,require){r("skylark-langx-chars/chars",["skylark-langx-ns","skylark-langx-types"],function(r,n){return r.attach("langx.chars",{isWhiteSpace:function(r){return 32===r||9===r||13===r||10===r}})}),r("skylark-langx-chars/main",["./chars"],function(r){return r}),r("skylark-langx-chars",["skylark-langx-chars/main"],function(r){return r})}(e),!t){var s=require("skylark-langx-ns");a?module.exports=s:n.skylarkjs=s}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-chars.js.map
