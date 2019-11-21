/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,e,a){"use strict";var d=n("./hash_handler").HashHandler;e.handler=new d,[{bindKey:"Shift-Tab|Tab",command:"passKeysToBrowser"},{bindKey:{win:"Ctrl-L",mac:"Cmd-L"},command:"passKeysToBrowser"},{bindKey:{win:"Ctrl-G",mac:"Cmd-G"},command:"gotoline"},{bindKey:{win:"Ctrl-T|Ctrl-Shift-T|Ctrl-K",mac:"Cmd-T|Cmd-Shift-T"},command:{name:"passKeysToBrowser",exec:function(){},passEvent:!0,readOnly:!0}},{bindKey:{win:"Ctrl-G",mac:"Cmd-G"},command:"passKeysToBrowser"},{bindKey:{win:"Ctrl-G",mac:"Cmd-G"},command:"passKeysToBrowser"},{command:"golineup",bindKey:{win:null,mac:"Ctrl-P"}},{command:"golinedown",bindKey:{win:null,mac:"Ctrl-N"}},{command:"gotoleft",bindKey:{win:null,mac:"Ctrl-B"}},{command:"gotoright",bindKey:{win:null,mac:"Ctrl-F"}},{command:"gotolineend",bindKey:{win:null,mac:"Ctrl-E"}},{command:"gotolinestart",bindKey:{win:null,mac:"Ctrl-A"}}].forEach(function(n){var a=n.bindKey;"object"==typeof a&&(a=a[e.handler.platform]),e.handler.bindKey(a,n.command)}),e.handler.$id="ace/keyboard/textarea"});
//# sourceMappingURL=../sourcemaps/keyboard/textarea.js.map
