/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./base","./Widget","./mixins/TextMixin"],function(t,e,i){"use strict";var n=e.inherit({_construct:function(t){e.prototype._construct.call(this,t,"div");var i=this.getSkin();this._elm.style.pointerEvents="none",this._elm.style.color=i.textColor,this._elm.style.display="flex",this._buildText()},...i});return n.CENTER=0,n.LEFT=1,n.RIGHT=2,n.TOP=3,n.BOTTOM=4,n.CLIP=10,n.ELLIPSIS=11,t.TextPane=n});
//# sourceMappingURL=sourcemaps/TextPane.js.map
