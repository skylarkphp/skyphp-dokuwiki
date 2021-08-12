/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./streams","./_stream"],function(t,r){var n=r.inherit({klassName:"StringStream",_construct:function(t){for(var n=t.length,e=new Uint8Array(n),a=0;a<n;++a)e[a]=t.charCodeAt(a);r.prototype._construct.call(this,e)}});return t.StringStream=n});
//# sourceMappingURL=sourcemaps/string-stream.js.map
