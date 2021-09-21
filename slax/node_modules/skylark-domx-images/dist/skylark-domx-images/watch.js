/**
 * skylark-domx-images - The skylark image library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-eventer","./images","./is-completed","./is-loaded"],function(e,n,o,r,t){return o.watch=function(o){e.isArray(o)||(o=[o]);var i=o.length,s=0,a=0,l=0,c=new e.Deferred;function d(){c.resolve({total:i,successed:a,failered:l,imgs:o})}function f(e,n){s++,n?a++:l++,c.progress({img:e,isLoaded:n,progressed:s,total:i,imgs:o}),s==i&&d()}return e.defer(function(){o.length?o.forEach(function(e){r(e)?f(e,t(e)):n.on(e,{load:function(){f(e,!0)},error:function(){f(e,!1)}})}):d()}),c.promise.totalCount=i,c.promise}});
//# sourceMappingURL=sourcemaps/watch.js.map
