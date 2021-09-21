/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-urls/get-query","skylark-domx-noder","skylark-domx-geom","skylark-domx-styler","./iframes","./create","./load-real","./lazy-load"],function(e,r,a,i,l,s,t,d){"use strict";return l.replace=function(l,m){m=m||{},s({className:l.className,id:l.id,style:{border:"1px solid #aaa"}});var h=m.url||l.href,o=m.size||e(l.search),c=m.holdingUrl;i.css(iframe,"width",o.width||"100%"),i.css(iframe,"minHeight",o.height||"300px"),o.height&&i.css(iframe,"maxHeight",o.height),a.inview(l,100)?t(iframe,{url:h}):d(iframe,{url:h,holdingUrl:c}),r.replace(iframe,l)}});
//# sourceMappingURL=sourcemaps/replace.js.map
