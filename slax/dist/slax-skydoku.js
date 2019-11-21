/**
 * slax-skydoku - The skydoku slax application.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link skydoku.hudaokeji.com
 * @license 
 */
!function(r,e){var n=e.define,o=e.require,t="function"==typeof n&&n.amd,s=!t&&"undefined"!=typeof exports;if(!t&&!n){var i={};n=e.define=function(r,e,n){"function"==typeof n?(i[r]={factory:n,deps:e.map(function(e){return function(r,e){if("."!==r[0])return r;var n=e.split("/"),o=r.split("/");n.pop();for(var t=0;t<o.length;t++)"."!=o[t]&&(".."==o[t]?n.pop():n.push(o[t]));return n.join("/")}(e,r)}),resolved:!1,exports:null},o(r)):i[r]={factory:null,resolved:!0,exports:n}},o=e.require=function(r){if(!i.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var n=i[r];if(!n.resolved){var t=[];n.deps.forEach(function(r){t.push(o(r))}),n.exports=n.factory.apply(e,t)||null,n.resolved=!0}return n.exports}}if(!n)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,e){r("slax-skydoku/main",["skylark-slax-runtime","skylark-widgets-coder","skylark-widgets-textpad","skylark-jqueryui"],function(r){return r}),r("slax-skydoku",["slax-skydoku/main"],function(r){return r})}(n),!t){var u=o("skylark-langx/skylark");s?module.exports=u:e.skylarkjs=u}}(0,this);
//# sourceMappingURL=sourcemaps/slax-skydoku.js.map
