/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-eventer","./iframes"],function(e,n){"use strict";return n.hookSizing=function(n){e.on(window,"message",function(e){e||(e=window.event),n.style.height=1*e.data.height+2+"px"})}});
//# sourceMappingURL=sourcemaps/hook-sizing.js.map
