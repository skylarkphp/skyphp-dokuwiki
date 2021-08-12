/**
 * skylark-widgets-toolbars - The skylark toolbar widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-toolbars/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-plugins-panels/Toolbar","skylark-widgets-base/Widget","./toolbars","./ToolbarItem"],function(t,o,a,n,i,l){var r=n.inherit({klassName:"Toolbar",pluginName:"lark.wordpad.toolbar",options:{template:'<div class="domx-toolbar"><ul></ul></div>'},_construct:function(t,o){n.prototype._construct.call(this,t,o)},_init:function(){this._xtoolbar=a.instantiate(this._elm,this.options),this.buttons=[];for(var t=this.options.actions,o=0;o<t.length;o++){var n=t[o];if("|"!==n.name){var i=n.toolItemCtor;i||(i=l),this.buttons.push(new i({action:n,toolbar:this}))}else this._xtoolbar.addSeparator()}},addToolItem:function(t){this._xtoolbar.addToolItem(t)},findButton:function(t){var o;return null!=(o=this._xtoolbar.list.find(".toolbar-item-"+t).data("button"))?o:null}});return r.addButton=function(t){return this.buttons[t.prototype.name]=t},r.buttons={},i.Toolbar=r});
//# sourceMappingURL=sourcemaps/Toolbar.js.map
