/**
 * skylark-langx-emitter - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","skylark-langx-funcs","skylark-langx-klass"],function(t,e,n){var a={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};function r(n,r){return!r&&n.isDefaultPrevented||(r||(r=n),t.each(a,function(t,a){var s=r[t];n[t]=function(){return this[a]=e.returnTrue,s&&s.apply(r,arguments)},n[a]=e.returnFalse})),n}class s extends CustomEvent{constructor(e,n){super(e,n),t.safeMixin(this,n),r(this)}}return s.compatible=r,s});
//# sourceMappingURL=sourcemaps/Event.js.map
