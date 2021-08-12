/**
 * skylark-langx-klass - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(r,n){var e=n.define,require=n.require,s="function"==typeof e&&e.amd,t=!s&&"undefined"!=typeof exports;if(!s&&!e){var a={};e=n.define=function(r,n,e){"function"==typeof e?(a[r]={factory:e,deps:n.map(function(n){return function(r,n){if("."!==r[0])return r;var e=n.split("/"),s=r.split("/");e.pop();for(var t=0;t<s.length;t++)"."!=s[t]&&(".."==s[t]?e.pop():e.push(s[t]));return e.join("/")}(n,r)}),resolved:!1,exports:null},require(r)):a[r]={factory:null,resolved:!0,exports:e}},require=n.require=function(r){if(!a.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var module=a[r];if(!module.resolved){var e=[];module.deps.forEach(function(r){e.push(require(r))}),module.exports=module.factory.apply(n,e)||null,module.resolved=!0}return module.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,require){r("skylark-langx-klass/klass",["skylark-langx-ns","skylark-langx-constructs/klass"],function(r,n){return r.attach("langx.klass",n)}),r("skylark-langx-klass/main",["./klass"],function(r){return r}),r("skylark-langx-klass",["skylark-langx-klass/main"],function(r){return r})}(e),!s){var o=require("skylark-langx-ns");t?module.exports=o:n.skylarkjs=o}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-klass.js.map
