/**
 * skylark-io-caches - The skylarkjs web local storage classes library.
 * @author 
 * @version v0.9.0
 * @link 
 * @license MIT
 */
define(["skylark-langx-types","skylark-langx-objects/mixin","skylark-langx-datetimes","./caches"],function(e,n,s,t){"use strict";function a(){return a}return n(a,{get:function(e){return sKey&&this.has(e)?unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1")):null},has:function(e){return new RegExp("(?:^|;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},list:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),n=0;n<e.length;n++)e[n]=unescape(e[n]);return e},remove:function(e,n){e&&this.has(e)&&(document.cookie=escape(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(n?"; path="+n:""))},set:function(n,t,a,i,c,o){if(n&&!/^(?:expires|max\-age|path|domain|secure)$/i.test(n)){var r=e.type(a);if("number"===r){var u=Date.now();u.setTime(u.getTime()+24*expire*60*60*1e3),a=u}else"string"===r&&(a=new Date(Date.now()+s.parseMilliSeconds(a)));document.cookie=escape(n)+"="+escape(t)+(a?"; domain="+a.toGMTString():"")+(c?"; domain="+c:"")+(i?"; path="+i:"")+(o?"; secure":"")}}}),t.cookie=a});
//# sourceMappingURL=sourcemaps/cookie.js.map
