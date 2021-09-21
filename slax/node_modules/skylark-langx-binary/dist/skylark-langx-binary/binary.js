/**
 * skylark-langx-binary - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(r){"use strict";return r.attach("langx.binary",{fromBase64:function(r){for(var n,t,e,f,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=r.length/4*3,u=new ArrayBuffer(i),c=new Uint8Array(u),o=0,A=0;o<i;o+=3)n=a.indexOf(r.charAt(A++)),t=a.indexOf(r.charAt(A++)),e=a.indexOf(r.charAt(A++)),f=a.indexOf(r.charAt(A++)),c[o]=n<<2|t>>4,64!==e&&(c[o+1]=(15&t)<<4|e>>2),64!==f&&(c[o+2]=(3&e)<<6|f);return u},fromBinaryString:function(r){for(var n=r.length,t=new ArrayBuffer(n),e=new Uint8Array(t),f=0;f<n;f++)e[f]=r.charCodeAt(f);return t},fromBuffer:function(r){for(var n=new ArrayBuffer(r.length),t=new Uint8Array(n),e=0;e<r.length;e++)t[e]=r[e];return n},readInt8:function(r,n){return r[n]<<24>>24},readUint16:function(r,n){return r[n]<<8|r[n+1]},readUint32:function(r,n){return(r[n]<<24|r[n+1]<<16|r[n+2]<<8|r[n+3])>>>0}})});
//# sourceMappingURL=sourcemaps/binary.js.map
