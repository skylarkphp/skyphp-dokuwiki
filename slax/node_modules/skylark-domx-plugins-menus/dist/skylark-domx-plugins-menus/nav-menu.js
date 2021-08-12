/**
 * skylark-domx-plugins-menus - The skylark menu plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-menus/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-lists","skylark-domx-plugins-base","./menus","./menu"],function(e,t,s,i,n,l){"use strict";var r=l.inherit({klassName:"NavMenu",pluginName:"lark.menus.nav",options:{item:{templates:{}}},_construct:function(e,t){l.prototype._construct.call(this,e,t),this.options.data.items&&this.resetItems(this.options.data.items),s.multitier(e,{togglable:!1,classes:{active:this.options.item.classes.active},selectors:{item:this.options.item.selectors.general,sublist:this.options.submenu.selectors.descendant,hasSublist:this.options.item.selectors.hasChildren},multiExpand:!1})},resetItems:function(e){let t=this;let s=this.$(this.options.selectors.container);e.forEach(e=>{!function e(s,i){let n;if((n=s.children?t.renderHasChildrenMenuItem(s):t.renderGeneralMenuItem(s)).data("item",s),i.append(n),s.children){let i=n.find(t.options.submenu.selectors.children);s.children.forEach(t=>{e(t,i)})}}(e,s)})}});return i.register(r),n.NavMenu=r});
//# sourceMappingURL=sourcemaps/nav-menu.js.map
