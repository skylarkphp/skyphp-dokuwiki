/**
 * skylark-langx-scripter - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx"],function(e,a,t){var r=document.getElementsByTagName("head")[0],l={},n={},o=0;function d(){return d}var c={type:!0,src:!0,nonce:!0,noModule:!0};return a.mixin(d,{loadJavaScript:function(e,a,t){var d=l[e];if(d||(d=l[e]={state:0,loadedCallbacks:[],errorCallbacks:[]}),d.loadedCallbacks.push(a),d.errorCallbacks.push(t),1===d.state)d.node.onload();else if(-1===d.state)d.node.onerror();else{var c=d.node=document.createElement("script"),s=d.id=o++;c.type="text/javascript",c.async=!1,c.defer=!1,startTime=(new Date).getTime(),r.appendChild(c),c.onload=function(){d.state=1;for(var e=d.loadedCallbacks,a=e.length;a--;)e[a]();d.loadedCallbacks=[],d.errorCallbacks=[]},c.onerror=function(){d.state=-1;for(var e=d.errorCallbacks,a=e.length;a--;)e[a]();d.loadedCallbacks=[],d.errorCallbacks=[]},c.src=e,n[s]=c}return d.id},deleteJavaScript:function(e){var a=n[e];if(a){var t=a.src;a.parentNode&&a.parentNode.remove(a),delete n[e],delete l[t]}},evaluate:function(e,a,t){var r,l,n=(t=t||document).createElement("script");if(n.text=e,a)for(r in c)(l=a[r]||a.getAttribute&&a.getAttribute(r))&&n.setAttribute(r,l);return t.head.appendChild(n).parentNode.removeChild(n),this}}),e.attach("langx.scripter",d)});
//# sourceMappingURL=sourcemaps/scripter.js.map
