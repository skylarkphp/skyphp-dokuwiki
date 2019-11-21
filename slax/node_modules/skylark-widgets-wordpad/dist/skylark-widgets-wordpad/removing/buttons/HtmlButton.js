/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button"],function(t,e,r,i){var o=i.inherit({});return o.prototype.name="html",o.prototype.icon="html5",o.prototype.needFocus=!1,o.prototype._init=function(){var t;return i.prototype._init.call(this),this.editor.textarea.on("focus",(t=this,function(e){return t.editor.el.addClass("focus").removeClass("error")})),this.editor.textarea.on("blur",function(t){return function(e){return t.editor.el.removeClass("focus"),t.editor.setValue(t.editor.textarea.val())}}(this)),this.editor.textarea.on("input",function(t){return function(e){return t._resizeTextarea()}}(this))},o.prototype.status=function(){},o.prototype.command=function(){var t,e,r,i;for(this.editor.blur(),this.editor.el.toggleClass("wordpad-html"),this.editor.htmlMode=this.editor.el.hasClass("wordpad-html"),this.editor.htmlMode?(this.editor.hidePopover(),this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val())),this._resizeTextarea()):this.editor.setValue(this.editor.textarea.val()),e=0,r=(i=this.editor.toolbar.buttons).length;e<r;e++)"html"===(t=i[e]).name?t.setActive(this.editor.htmlMode):t.setDisabled(this.editor.htmlMode);return null},o.prototype.beautifyHTML=function(){return arguments[0]},o.prototype._resizeTextarea=function(){return this._textareaPadding||(this._textareaPadding=this.editor.textarea.innerHeight()-this.editor.textarea.height()),this.editor.textarea.height(this.editor.textarea[0].scrollHeight-this._textareaPadding)},r.Toolbar.addButton(o),o});
//# sourceMappingURL=../../sourcemaps/removing/buttons/HtmlButton.js.map
