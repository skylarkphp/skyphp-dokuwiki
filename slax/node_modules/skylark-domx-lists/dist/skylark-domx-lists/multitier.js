/**
 * skylark-domx-lists - The skylark lists library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx","skylark-domx-query","./lists"],function(s,l,e){"use strict";return e.multitier=function(e,i){var t=(i=s.mixin({classes:{active:"active",collapse:"collapse",in:"in"},selectors:{item:"li",sublist:"ul",hasSublist:":has(ul)",handler:" > a"},mode:"",levels:2,togglable:!1,multiExpand:!1},i,!0)).selectors.item,a=l(t,e),n=i.classes.active,c="."+n,o=(i.mode,i.selectors.sublist),r=i.togglable,d=i.multiExpand,u=i.selectors.handler,h=i.classes.collapse,m=i.classes.in,f=i.show||function(s){s.addClass(m)},v=i.hide||function(s){s.addClass(h).removeClass(m)};i.toggle,a.find(u).on("click.multitier",function(s){s.preventDefault();let e,a=l(this).closest(t);d||(e=a.siblings().removeClass(n).children(o))&&v(e);let c=a.hasClass(n);c&&!r||(e=a.children(i.selectors.sublist),c?(a.removeClass(n),v(e)):(a.addClass(n),f(e)))}),v(a.has(o).children(o)),f(a.filter(c).has(o).children(o))}});
//# sourceMappingURL=sourcemaps/multitier.js.map
