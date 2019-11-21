/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button","../i18n"],function(t,e,a,i,r){var n=i.inherit({});return n.prototype.name="title",n.prototype.htmlTag="h1, h2, h3, h4, h5",n.prototype.disableTag="pre, table",n.prototype._init=function(){return this.menu=[{name:"normal",text:r.translate("normalText"),param:"p"},"|",{name:"h1",text:r.translate("title")+" 1",param:"h1"},{name:"h2",text:r.translate("title")+" 2",param:"h2"},{name:"h3",text:r.translate("title")+" 3",param:"h3"},{name:"h4",text:r.translate("title")+" 4",param:"h4"},{name:"h5",text:r.translate("title")+" 5",param:"h5"}],i.prototype._init.call(this)},n.prototype.setActive=function(t,e){if(i.prototype.setActive.call(this,t),t&&(e||(e=this.node[0].tagName.toLowerCase())),this.el.removeClass("active-p active-h1 active-h2 active-h3 active-h4 active-h5"),t)return this.el.addClass("active active-"+e)},n.prototype.command=function(t){return this.editor.editable.title(t,this.disableTag)},a.Toolbar.addButton(n),n});
//# sourceMappingURL=../../sourcemaps/removing/buttons/TitleButton.js.map
