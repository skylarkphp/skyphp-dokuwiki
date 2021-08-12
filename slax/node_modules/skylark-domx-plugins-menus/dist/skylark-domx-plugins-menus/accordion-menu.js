/**
 * skylark-domx-plugins-menus - The skylark menu plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-menus/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-lists","skylark-domx-plugins-base","./menus","./menu"],function(s,e,t,i,n,o){"use strict";var l=o.inherit({klassName:"AccordionMenu",pluginName:"lark.menus.accordion",_construct:function(s,e){o.prototype._construct.call(this,s,e),t.multitier(s,{togglable:!0,classes:{active:this.options.item.classes.active},selectors:{item:this.options.item.selectors.general,sublist:this.options.submenu.selectors.descendant,hasSublist:this.options.item.selectors.hasChildren},multiExpand:!1})}});return i.register(l),n.AccordionMenu=l});
//# sourceMappingURL=sourcemaps/accordion-menu.js.map
