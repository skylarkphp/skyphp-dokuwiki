/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";var f={buffer:[],push:function(u){-1===f.buffer.indexOf(u)&&f.buffer.push(u)},pop:function(u){for(var r=0;r<f.buffer.length;r++)if(f.buffer[r].uuid===u){var e=f.buffer[r];return f.buffer.splice(r,1),e}return null},get:function(u){for(var r=0;r<f.buffer.length;r++)if(f.buffer[r].uuid===u)return f.buffer[r];return null}};return f});
//# sourceMappingURL=../sourcemaps/dnd/drag-buffer.js.map
