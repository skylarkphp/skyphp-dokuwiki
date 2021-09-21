/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./base","./widget"],function(t,e){"use strict";var n=e.inherit({_construct:function(t){e.prototype._construct.call(this,t,"img"),this._elm.style.borderStyle="none",this._elm.style.objectFit="contain"},setImage:function(t){this._elm.src=t}});return t.ImagePane=n});
//# sourceMappingURL=sourcemaps/image-pane.js.map
