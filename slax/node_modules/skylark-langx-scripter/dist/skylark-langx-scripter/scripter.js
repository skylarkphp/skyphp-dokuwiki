/**
 * skylark-langx-scripter - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx"],function(e,t){var r=document.getElementsByTagName("head")[0],a={},n={},l=0;function o(){return o}var c={type:!0,src:!0,nonce:!0,noModule:!0};return t.mixin(o,{loadJavaScript:function(e,t,o){var c=a[e];if(c||(c=a[e]={state:0,loadedCallbacks:[],errorCallbacks:[]}),c.loadedCallbacks.push(t),c.errorCallbacks.push(o),1===c.state)c.node.onload();else if(-1===c.state)c.node.onerror();else{var d=c.node=document.createElement("script"),i=c.id=l++;d.type="text/javascript",d.async=!1,d.defer=!1,startTime=(new Date).getTime(),r.appendChild(d),d.onload=function(){c.state=1;for(var e=c.loadedCallbacks,t=e.length;t--;)e[t]();c.loadedCallbacks=[],c.errorCallbacks=[]},d.onerror=function(){c.state=-1;for(var e=c.errorCallbacks,t=e.length;t--;)e[t]();c.loadedCallbacks=[],c.errorCallbacks=[]},d.src=e,n[i]=d}return c.id},deleteJavaScript:function(e){var t=n[e];if(t){var r=t.src;t.parentNode&&t.parentNode.remove(t),delete n[e],delete a[r]}},evaluate:function(e,t,r){var a,n,l=(r=r||document).createElement("script");if(l.text=e,t)for(a in c)(n=t[a]||t.getAttribute&&t.getAttribute(a))&&l.setAttribute(a,n);return r.head.appendChild(l).parentNode.removeChild(l),this},loadScript:function(e){var r=new t.Deferred;return r.promise.scriptId=this.loadJavaScript(e,function(){r.resolve()},function(e){r.reject(e)}),r.promise}}),e.attach("langx.scripter",o)});
//# sourceMappingURL=sourcemaps/scripter.js.map
