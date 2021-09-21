/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(e){"use strict";const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";return e.createObjectURL=function(e,n,c=!1){if(!c&&URL.createObjectURL){const t=new Blob([e],{type:n});return URL.createObjectURL(t)}let r=`data:${n};base64,`;for(let n=0,c=e.length;n<c;n+=3){const o=255&e[n],s=255&e[n+1],u=255&e[n+2],a=(3&o)<<4|s>>4,b=n+1<c?(15&s)<<2|u>>6:64,f=n+2<c?63&u:64;r+=t[o>>2]+t[a]+t[b]+t[f]}return r}});
//# sourceMappingURL=sourcemaps/create_object_url.js.map
