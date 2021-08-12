/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/objects","skylark-domx-eventer","skylark-domx-velm","skylark-domx-query","skylark-io-diskfs/select","./files"],function(e,r,k,n,i,t){function c(e,k){return r.on(e,"click",function(e){e.preventDefault(),i(k)}),this}return t.picker=c,k.delegate(["picker"],t),n.fn.picker=n.wraps.wrapper_every_act(t.picker,t),c});
//# sourceMappingURL=sourcemaps/picker.js.map
