/**
 * skylark-domx-forms - The skylark html form library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./forms","skylark-domx-velm","skylark-domx-query","./deserialize","./serialize-array","./serialize-object","./serialize"],function(e,r,i){return r.delegate(["deserialize","serializeArray","serializeObject","serialize"],e),i.fn.deserialize=i.wraps.wrapper_value(e.deserialize,e,e.deserialize),i.fn.serializeArray=i.wraps.wrapper_value(e.serializeArray,e,e.serializeArray),i.fn.serializeObject=i.wraps.wrapper_value(e.serializeObject,e,e.serializeObject),i.fn.serialize=i.wraps.wrapper_value(e.serialize,e,e.serialize),e});
//# sourceMappingURL=sourcemaps/main.js.map
