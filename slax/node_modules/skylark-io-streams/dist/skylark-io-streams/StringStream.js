/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./Stream"],function(r,t,a,n){var e=n.inherit({klassName:"StringStream",init:function(r){for(var t=r.length,a=new Uint8Array(t),n=0;n<t;++n)a[n]=r.charCodeAt(n);DecodeStream.prototype.init.call(this)}});return a.StringStream=e});
//# sourceMappingURL=sourcemaps/StringStream.js.map
