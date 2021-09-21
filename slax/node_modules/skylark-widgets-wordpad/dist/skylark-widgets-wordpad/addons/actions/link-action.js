/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../action","../../i18n","./link-popover"],function(t,e,o,i,n){var r=o.inherit({name:"link",icon:"link",htmlTag:"a",disableTag:"pre",_status:function(){return o.prototype._status.call(this),this.active&&!this.editor.editable.selection.rangeAtEndOf(this.node)?(this.popover||(this.popover=new n({action:this})),this.popover.show(this.node)):this.popover?this.popover.hide():void 0},_execute:function(){var t;return this.active&&this.popover.one("popovershow",(t=this,function(){return linkText?(t.popover.urlEl.focus(),t.popover.urlEl[0].select()):(t.popover.textEl.focus(),t.popover.textEl[0].select())})),this.editor.editable.link(this.active,i.translate("linkText"))}});return e.actions.link=r,r});
//# sourceMappingURL=../../sourcemaps/addons/actions/link-action.js.map
