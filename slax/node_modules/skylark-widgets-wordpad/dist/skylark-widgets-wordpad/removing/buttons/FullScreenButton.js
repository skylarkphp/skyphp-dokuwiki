/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button","../i18n"],function(t,i,e,o,s){var r=o.inherit({name:"fullscreen",needFocus:!1,_init:function(){return o.prototype._init.call(this),this.window=t(window),this.body=t("body"),this.editable=this.editor.body,this.toolbar=this.toolbar.wrapper}});return r.cls="wordpad-fullscreen",r.i18n={"zh-CN":{fullscreen:"全屏"}},r.prototype.iconClassOf=function(){return"icon-fullscreen"},r.prototype.status=function(){return this.setActive(this.body.hasClass(this.constructor.cls))},r.prototype.command=function(){var t,i,e;return this.body.toggleClass(this.constructor.cls),(i=this.body.hasClass(this.constructor.cls))?(t=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.wordpad-fullscreen-"+this.editor.id,(e=this,function(){return e._resize({height:e.window.height()-e.toolbar.outerHeight()-t})})).resize()):(this.window.off("resize.wordpad-fullscreen-"+this.editor.id).resize(),this._resize({height:"auto"})),this.setActive(i)},r.prototype._resize=function(t){return this.editable.height(t.height)},e.Toolbar.addButton(r),r});
//# sourceMappingURL=../../sourcemaps/removing/buttons/FullScreenButton.js.map
