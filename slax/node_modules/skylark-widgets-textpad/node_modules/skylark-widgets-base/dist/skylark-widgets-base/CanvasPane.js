/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./base","./Widget"],function(t,e){"use strict";var i=e.inherit({klassName:"CanvasPane",_construct:function(t){e.prototype._construct.call(this,t,"canvas"),this.preventDragEvents()},getContext:function(t){return this._elm.getContext(t)},updateSize:function(){e.prototype.updateSize.call(this);var t=Editor.getPixelRatio();this._elm.width=this.size.x*t,this._elm.height=this.size.y*t}});return t.CanvasPane=i});
//# sourceMappingURL=sourcemaps/CanvasPane.js.map
