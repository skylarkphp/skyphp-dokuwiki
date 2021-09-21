/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-numerics/vector2","../widget"],function(t,i){"use strict";return{_buildImage:function(t){this.icon=document.createElement("img"),this.icon.style.pointerEvents="none",this.icon.style.position="absolute",this.icon.style.top="15%",this.icon.style.left="15%",this.icon.style.width="70%",this.icon.style.height="70%",this._elm.appendChild(this.icon)},setImage:function(t){this.icon.src=t},setImageScale:function(t,i){this.icon.style.top=(1-i)/2*100+"%",this.icon.style.left=(1-t)/2*100+"%",this.icon.style.width=100*t+"%",this.icon.style.height=100*i+"%"}}});
//# sourceMappingURL=../sourcemaps/mixins/image-mixin.js.map
