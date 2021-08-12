/**
 * slax-skydoku - The skydoku slax application.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link skydoku.hudaokeji.com
 * @license 
 */
!function(r,e){var o=e.define,require=e.require,n="function"==typeof o&&o.amd,t=!n&&"undefined"!=typeof exports;if(!n&&!o){var s={};o=e.define=function(r,e,o){"function"==typeof o?(s[r]={factory:o,deps:e.map(function(e){return function(r,e){if("."!==r[0])return r;var o=e.split("/"),n=r.split("/");o.pop();for(var t=0;t<n.length;t++)"."!=n[t]&&(".."==n[t]?o.pop():o.push(n[t]));return o.join("/")}(e,r)}),resolved:!1,exports:null},require(r)):s[r]={factory:null,resolved:!0,exports:o}},require=e.require=function(r){if(!s.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var module=s[r];if(!module.resolved){var o=[];module.deps.forEach(function(r){o.push(require(r))}),module.exports=module.factory.apply(e,o)||null,module.resolved=!0}return module.exports}}if(!o)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,require){r("slax-skydoku/main",["skylark-slax-runtime","skylark-bootstrap3/loadedInit","skylark-appify-shells","skylark-widgets-coder","skylark-widgets-textpad","skylark-jqueryui"],function(r,e){return e(),r}),r("slax-skydoku",["slax-skydoku/main"],function(r){return r})}(o),!n){var i=require("skylark-langx-ns");t?module.exports=i:e.skylarkjs=i}}(0,this);
//# sourceMappingURL=sourcemaps/slax-skydoku.js.map
