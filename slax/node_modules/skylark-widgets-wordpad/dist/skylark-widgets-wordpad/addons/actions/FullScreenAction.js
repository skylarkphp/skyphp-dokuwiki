/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(t,i,e,s){var n=e.inherit({name:"fullscreen",needFocus:!1,_init:function(){e.prototype._init.call(this),this.window=t(window),this.body=t("body"),this.editable=this.editor.body},iconClassOf:function(){return"icon-fullscreen"},status:function(){return this.setActive(this.body.hasClass(this.constructor.cls))},_execute:function(){var t,i,e;return this.body.toggleClass(this.constructor.cls),(i=this.body.hasClass(this.constructor.cls))?(t=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.wordpad-fullscreen-"+this.editor.id,(e=this,function(){return e._resize({height:e.window.height()-e.editor.toolbar.outerHeight()-t})})).resize()):(this.window.off("resize.wordpad-fullscreen-"+this.editor.id).resize(),this._resize({height:"auto"})),this.setActive(i)},_resize:function(t){return this.editable.height(t.height)}});return n.cls="wordpad-fullscreen",n.i18n={"zh-CN":{fullscreen:"全屏"}},i.actions.fullscreen=n,n});
//# sourceMappingURL=../../sourcemaps/addons/actions/FullScreenAction.js.map
