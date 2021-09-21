/**
 * skylark-langx-events - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","skylark-langx-funcs","skylark-langx-klass","skylark-langx-hoster","./events"],function(e,t,n,a){var r={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};function s(n,a){return!a&&n.isDefaultPrevented||(a||(a=n),e.each(r,function(e,r){var s=a[e];n[e]=function(){return this[r]=t.returnTrue,s&&s.apply(a,arguments)},n[r]=t.returnFalse})),n}class o extends CustomEvent{constructor(t,n){super(t,n),e.safeMixin(this,n),s(this)}}return o.compatible=s,a.Event=o});
//# sourceMappingURL=sourcemaps/event.js.map
