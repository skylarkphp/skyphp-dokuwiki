/**
 * skylark-langx-topic - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-langx-events"],function(n,t){var a=new t.Emitter;return n.attach("langx.topic",{publish:function(n,t,r){var e=[].slice.call(arguments,1);return a.trigger({type:n,data:e})},subscribe:function(n,t,r){var e=function(n){t.apply(r,n.data)};return a.on(n,e),{remove:function(){a.off(n,e)}}}})});
//# sourceMappingURL=sourcemaps/topic.js.map
