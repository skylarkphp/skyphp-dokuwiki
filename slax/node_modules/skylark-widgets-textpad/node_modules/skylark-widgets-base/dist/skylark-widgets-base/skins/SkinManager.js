/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";var t=[],n=[];return{register:function(e,r){t.push(r),n[r]=e},get:function(e){return e||(e=t[0]),n[e]},getList:function(){return t.slice()}}});
//# sourceMappingURL=../sourcemaps/skins/SkinManager.js.map
