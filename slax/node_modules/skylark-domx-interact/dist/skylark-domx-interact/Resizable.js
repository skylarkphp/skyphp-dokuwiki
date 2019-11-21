/**
 * skylark-domx-interact - The interact features enhancement for dom.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-noder","skylark-domx-data","skylark-domx-finder","skylark-domx-geom","skylark-domx-eventer","skylark-domx-styler","skylark-domx-query","skylark-domx-plugins","./interact","./Movable"],function(t,e,o,i,r,a,n,s,d,l,h){a.on,a.off,o.attr,o.removeAttr,r.pagePosition,n.addClass,r.height,Array.prototype.some,Array.prototype.map;var k=d.Plugin.inherit({klassName:"Resizable",pluginName:"lark.resizable",options:{touchActionNone:!0,direction:{top:!1,left:!1,right:!0,bottom:!0},handle:{border:!0,grabber:"",selector:!0}},_construct:function(e,o){this.overrided(e,o);var a,n,s,d=(o=this.options).handle||{},l=o.direction,k=o.started,m=o.moving,g=o.stopped;t.isString(d)?a=i.find(e,d):t.isHtmlNode(d)&&(a=d),h(a,{auto:!1,started:function(t){n=r.size(e),k&&k(t)},moving:function(t){s={},l.left||l.right?s.width=n.width+t.deltaX:s.width=n.width,l.top||l.bottom?s.height=n.height+t.deltaY:s.height=n.height,r.size(e,s),m&&m(t)},stopped:function(t){g&&g(t)}}),this._handleEl=a},remove:function(){a.off(this._handleEl)}});return d.register(k,"resizable"),l.Resizable=k});
//# sourceMappingURL=sourcemaps/Resizable.js.map
