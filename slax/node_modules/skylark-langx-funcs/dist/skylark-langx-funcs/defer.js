/**
 * skylark-langx-funcs - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./funcs"],function(n,e){return e.defer=function(e,i,t,c){var r={cancel:null},u=e;if(n.isNumber(i)||n.isFunction(i)||(c=t,t=i,i=0),t&&(u=function(){e.apply(c,t)}),n.isFunction(i)){var a=!1;i(function(){a||u()}),r.cancel=function(){a=!0}}else{var o;0==i&&requestAnimationFrame?(o=requestAnimationFrame(u),r.cancel=function(){return cancelAnimationFrame(o)}):(o=setTimeout(u,i),r.cancel=function(){return clearTimeout(o)})}return r}});
//# sourceMappingURL=sourcemaps/defer.js.map
