/**
 * skylark-visibility - A version of visibility.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-visibility/
 * @license MIT
 */
define(["./core"],function(e){var n,i=-1;return(n=e).every=function(e,t,d){n._time(),d||(d=t,t=null);var r=i+=1;return n._timers[r]={visible:e,hidden:t,callback:d},n._run(r,!1),n.isSupported()&&n._listen(),r},n.stop=function(e){return!!n._timers[e]&&(n._stop(e),delete n._timers[e],!0)},n._timers={},n._time=function(){n._timed||(n._timed=!0,n._wasHidden=n.hidden(),n.change(function(){n._stopRun(),n._wasHidden=n.hidden()}))},n._run=function(e,i){var t,d=n._timers[e];if(n.hidden()){if(null===d.hidden)return;t=d.hidden}else t=d.visible;var r=function(){d.last=new Date,d.callback.call(window)};if(i){var a=new Date-d.last;t>a?d.delay=setTimeout(function(){d.id=setInterval(r,t),r()},t-a):(d.id=setInterval(r,t),r())}else d.id=setInterval(r,t)},n._stop=function(e){var i=n._timers[e];clearInterval(i.id),clearTimeout(i.delay),delete i.id,delete i.delay},n._stopRun=function(e){var i=n.hidden(),t=n._wasHidden;if(i&&!t||!i&&t)for(var d in n._timers)n._stop(d),n._run(d,!i)},n});
//# sourceMappingURL=sourcemaps/visibility.js.map
