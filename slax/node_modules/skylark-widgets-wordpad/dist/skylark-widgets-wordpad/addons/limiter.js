/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
!function(t){t.Redactor.prototype.limiter=function(){return{init:function(){this.opts.limiter&&this.core.editor().on("keydown.redactor-plugin-limiter",t.proxy(function(t){var e=t.which,i=t.ctrlKey||t.metaKey;if(!(e===this.keyCode.BACKSPACE||e===this.keyCode.DELETE||e===this.keyCode.ESC||e===this.keyCode.SHIFT||i&&65===e||i&&82===e||i&&116===e)){var o=this.core.editor().text();return!((o=o.replace(/\u200B/g,"")).length>=this.opts.limiter)&&void 0}},this))}}}}(jQuery);
//# sourceMappingURL=../sourcemaps/addons/limiter.js.map
