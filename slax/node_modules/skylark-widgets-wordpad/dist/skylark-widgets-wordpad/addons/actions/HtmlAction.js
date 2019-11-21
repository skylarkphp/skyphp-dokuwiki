/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action"],function(t,e,i){var r=i.inherit({name:"html",icon:"html5",needFocus:!1,_init:function(){var t;return i.prototype._init.call(this),this.editor.textarea.on("focus",(t=this,function(e){return t.editor.el.addClass("focus").removeClass("error")})),this.editor.textarea.on("blur",function(t){return function(e){return t.editor.el.removeClass("focus"),t.editor.setValue(t.editor.textarea.val())}}(this)),this.editor.textarea.on("input",function(t){return function(e){return t._resizeTextarea()}}(this))},status:function(){},_execute:function(){var t,e,i,r;for(this.editor.blur(),this.editor.el.toggleClass("wordpad-html"),this.editor.htmlMode=this.editor.el.hasClass("wordpad-html"),this.editor.htmlMode?(this.editor.hidePopover(),this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val())),this._resizeTextarea()):this.editor.setValue(this.editor.textarea.val()),e=0,i=(r=this.editor._actions).length;e<i;e++)"html"===(t=r[e]).name?t.setActive(this.editor.htmlMode):t.setDisabled(this.editor.htmlMode);return null},beautifyHTML:function(){return arguments[0]},_resizeTextarea:function(){return this._textareaPadding||(this._textareaPadding=this.editor.textarea.innerHeight()-this.editor.textarea.height()),this.editor.textarea.height(this.editor.textarea[0].scrollHeight-this._textareaPadding)}});return e.actions.html=r,r});
//# sourceMappingURL=../../sourcemaps/addons/actions/HtmlAction.js.map
