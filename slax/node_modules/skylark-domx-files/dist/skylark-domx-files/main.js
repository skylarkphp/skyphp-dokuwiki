/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","skylark-domx-velm","skylark-domx-query","./dropzone","./pastezone","./picker"],function(e,r,p){return r.delegate(["dropzone","pastezone","picker"],e),p.fn.pastezone=p.wraps.wrapper_every_act(e.pastezone,e),p.fn.dropzone=p.wraps.wrapper_every_act(e.dropzone,e),p.fn.picker=p.wraps.wrapper_every_act(e.picker,e),e});
//# sourceMappingURL=sourcemaps/main.js.map
