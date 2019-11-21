/**
 * skylark-domx-interact - The interact features enhancement for dom.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-noder","skylark-domx-data","skylark-domx-finder","skylark-domx-geom","skylark-domx-eventer","skylark-domx-styler","skylark-domx-plugins","./interact","./ddmanager"],function(a,r,e,n,g,d,o,t,s,l){d.on,d.off,e.attr,e.removeAttr,g.pagePosition,o.addClass,g.height;var i=t.Plugin.inherit({klassName:"Draggable",pluginName:"lark.draggable",options:{draggingClass:"dragging"},_construct:function(r,g){this.overrided(r,g);var o=this;g=this.options;o.draggingClass=g.draggingClass,["preparing","started","ended","moving"].forEach(function(r){a.isFunction(g[r])&&o.on(r,g[r])}),d.on(r,{mousedown:function(a){var r=o.options;r.handle&&(o.dragHandle=n.closest(a.target,r.handle),!o.dragHandle)||(r.source?o.dragSource=n.closest(a.target,r.source):o.dragSource=o._elm,l.prepare(o),o.dragSource&&e.attr(o.dragSource,"draggable","true"))},mouseup:function(a){o.dragSource&&(o.dragSource=null,o.dragHandle=null)},dragstart:function(a){e.attr(o.dragSource,"draggable","false"),l.start(o,a)},dragend:function(a){d.stop(a),l.dragging&&l.end(!1)}})}});return t.register(i,"draggable"),s.Draggable=i});
//# sourceMappingURL=sourcemaps/Draggable.js.map
