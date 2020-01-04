/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(t,i,e,s){var n=e.inherit({name:"fullscreen",icon:"fullscreen",needFocus:!1,_init:function(){e.prototype._init.call(this),this.window=t(window),this.body=t("body"),this.editable=this.editor.body},status:function(){return this.setActive(this.body.hasClass(this.constructor.cls))},_execute:function(){var i,e,s;return this.body.toggleClass(this.constructor.cls),(e=this.body.hasClass(this.constructor.cls))?(i=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.wordpad-fullscreen-"+this.editor.id,(s=this,function(){return s._resize({height:s.window.height()-t(s.editor.toolbar._elm).outerHeight()-i})}))):this.window.off("resize.wordpad-fullscreen-"+this.editor.id),this.setActive(e)},_resize:function(t){return this.editable.height(t.height)}});return n.cls="wordpad-fullscreen",n.i18n={"zh-CN":{fullscreen:"全屏"}},i.actions.fullscreen=n,n});
//# sourceMappingURL=../../sourcemaps/addons/actions/FullScreenAction.js.map
