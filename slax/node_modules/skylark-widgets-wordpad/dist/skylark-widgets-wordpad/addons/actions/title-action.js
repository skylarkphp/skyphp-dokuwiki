/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action","../../i18n"],function(t,e,a,n){var i=a.inherit({name:"title",htmlTag:"h1, h2, h3, h4, h5",icon:"header",disableTag:"pre, table",_init:function(){return this.menu=[{name:"normal",text:n.translate("normalText"),param:"p"},"|",{name:"h1",text:n.translate("title")+" 1",param:"h1"},{name:"h2",text:n.translate("title")+" 2",param:"h2"},{name:"h3",text:n.translate("title")+" 3",param:"h3"},{name:"h4",text:n.translate("title")+" 4",param:"h4"},{name:"h5",text:n.translate("title")+" 5",param:"h5"}],a.prototype._init.call(this)},setActive:function(t,e){t&&(t=this.node[0].tagName.toLowerCase()),a.prototype.setActive.call(this,t)},_execute:function(t){return this.editor.editable.title(t,this.disableTag)}});return e.actions.title=i,i});
//# sourceMappingURL=../../sourcemaps/addons/actions/title-action.js.map
