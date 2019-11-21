/**
 * skylark-domx-data - The skylark data library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./data","skylark-domx-velm","skylark-domx-query"],function(a,r,e){return r.delegate(["attr","data","prop","removeAttr","removeData","text","val"],a),e.fn.text=e.wraps.wrapper_value(a.text,a,a.text),e.fn.attr=e.wraps.wrapper_name_value(a.attr,a,a.attr),e.fn.removeAttr=e.wraps.wrapper_every_act(a.removeAttr,a),e.fn.prop=e.wraps.wrapper_name_value(a.prop,a,a.prop),e.fn.removeProp=e.wraps.wrapper_every_act(a.removeProp,a),e.fn.data=e.wraps.wrapper_name_value(a.data,a,a.data),e.fn.removeData=e.wraps.wrapper_every_act(a.removeData,a),e.fn.val=e.wraps.wrapper_value(a.val,a,a.val),a});
//# sourceMappingURL=sourcemaps/main.js.map
