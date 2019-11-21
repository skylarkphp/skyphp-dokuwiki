/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(t,e,i,n){var a=i.inherit({name:"alignment",icon:"align-left",htmlTag:"p, h1, h2, h3, h4, td, th",_init:function(){i.prototype._init.call(this),this.menu=[{name:"left",text:n.translate("alignLeft"),icon:"align-left",param:"left"},{name:"center",text:n.translate("alignCenter"),icon:"align-center",param:"center"},{name:"right",text:n.translate("alignRight"),icon:"align-right",param:"right"}]},_execute:function(t){return this.editor.editable.alignment(t,this.htmlTag)},setActive:function(t){null==t&&(t="left"),"left"!==t&&"center"!==t&&"right"!==t&&(t="left"),i.prototype.setActive.call(this,t)},_status:function(){var t=this.editor.editable.status("alignment",this.htmlTag);return t?(this.setDisabled(!1),this.setActive(t)):(this.setDisabled(!0),this.setActive("left"))}});return e.actions.alignment=a});
//# sourceMappingURL=../../sourcemaps/addons/actions/AlignmentAction.js.map
