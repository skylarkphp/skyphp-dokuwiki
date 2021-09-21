/**
 * skylark-widgets-toolbars - The skylark toolbar widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-toolbars/
 * @license MIT
 */
define(["skylark-domx-query","skylark-domx-plugins-panels/toolbar","skylark-widgets-base/widget","./toolbars","./toolbar-item"],function(t,o,a,n,i){var r=a.inherit({klassName:"Toolbar",pluginName:"lark.wordpad.toolbar",options:{template:'<div class="domx-toolbar"><ul></ul></div>'},_construct:function(t,o){a.prototype._construct.call(this,t,o)},_init:function(){this._xtoolbar=o.instantiate(this._elm,this.options),this.buttons=[];for(var t=this.options.actions,a=0;a<t.length;a++){var n=t[a];if("|"!==n.name){var r=n.toolItemCtor;r||(r=i),this.buttons.push(new r({action:n,toolbar:this}))}else this._xtoolbar.addSeparator()}},addToolItem:function(t){this._xtoolbar.addToolItem(t)},findButton:function(t){var o;return null!=(o=this._xtoolbar.list.find(".toolbar-item-"+t).data("button"))?o:null}});return r.addButton=function(t){return this.buttons[t.prototype.name]=t},r.buttons={},n.Toolbar=r});
//# sourceMappingURL=sourcemaps/toolbar.js.map
