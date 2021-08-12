/**
 * skylark-domx-plugins-menus - The skylark menu plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-menus/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-lists","skylark-domx-plugins-base","./menus","./menu"],function(s,e,t,i,a,n){"use strict";var l=n.inherit({klassName:"CascadeMenu",pluginName:"lark.menus.cascade",_construct:function(s,e){n.prototype._construct.call(this,s,e),t.multitier(s,{togglable:!0,classes:{active:this.options.item.classes.active},selectors:{item:this.options.item.selectors.general,sublist:this.options.submenu.selectors.descendant,hasSublist:this.options.item.selectors.hasChildren},multiExpand:!1})}});return i.register(l),a.CascadeMenu=l});
//# sourceMappingURL=sourcemaps/cascade-menu.js.map
