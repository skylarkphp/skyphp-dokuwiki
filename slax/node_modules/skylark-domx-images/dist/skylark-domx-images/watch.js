/**
 * skylark-domx-images - The skylark image library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-eventer","./images","./isCompleted","./isLoaded"],function(e,n,o,r,t){return o.watch=function(o){e.isArray(o)||(o=[o]);var i=o.length,s=0,a=0,d=0,f=new e.Deferred;function l(){f.resolve({total:i,successed:a,failered:d,imgs:o})}function c(e,n){s++,n?a++:d++,f.progress({img:e,isLoaded:n,progressed:s,total:i,imgs:o}),s==i&&l()}return e.defer(function(){o.length?o.forEach(function(e){r(e)?c(e,t(e)):n.on(e,{load:function(){c(e,!0)},error:function(){c(e,!1)}})}):l()}),f.promise.totalCount=i,f.promise}});
//# sourceMappingURL=sourcemaps/watch.js.map
