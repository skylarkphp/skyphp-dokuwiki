/**
 * skylark-domx-interact - The interact features enhancement for dom.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-noder","skylark-domx-data","skylark-domx-geom","skylark-domx-eventer","skylark-domx-styler","skylark-domx-query","./interact","./Movable"],function(t,e,r,a,o,n,i,l,s){o.on,o.off,r.attr,r.removeAttr,a.pagePosition,n.addClass,a.height,Array.prototype.some,Array.prototype.map;var c,d,h,p,m,u,f,g,k="",y={left:!0,right:!0,top:!0,bottom:!0};function x(t){t.target;p=a.size(h),u&&u(t)}function v(t){m={},y.left||y.right?m.width=p.width+t.deltaX:m.width=p.width,y.top||y.bottom?m.height=p.height+t.deltaY:m.height=p.height,a.size(h,m),a.pageRect(c,a.pageRect(h)),f&&f(t)}function b(t){g&&g(t)}function z(){return z}return t.mixin(z,{init:function(t){k=(t=t||{}).classPrefix||"";var r=t.appendTo||document.body;for(var a in c=e.createElement("div",{class:k+"resizer-c"}),e.append(r,c),d={},["tl","tc","tr","cl","cr","bl","bc","br"].forEach(function(t){return d[t]=e.createElement("i",{class:k+"resizer-h "+k+"resizer-h-"+t,"data-resize-handler":t})}),d){var o=d[a];e.append(c,o),s(o,{auto:!1,started:x,moving:v,stopped:b})}},select:function(t,e){t&&t===h||(h=t,startDim=rectDim=startPos=null,a.pageRect(c,a.pageRect(h)),n.show(c))},unselect:function(t){c&&n.hide(c),h=null}}),l.Selectable=z});
//# sourceMappingURL=sourcemaps/Selectable.js.map
