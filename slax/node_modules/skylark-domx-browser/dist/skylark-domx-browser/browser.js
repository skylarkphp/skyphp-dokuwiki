/**
 * skylark-domx-browser - The skylark browser library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx"],function(n,r){"use strict";var i=r.hoster.browser;return r.mixin(i,{isIE:!!/msie/i.exec(window.navigator.userAgent),location:function(){return window.location},support:{}}),n.attach("domx.browser",i)});
//# sourceMappingURL=sourcemaps/browser.js.map
