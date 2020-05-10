/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var n=require("../lib/oop"),e=require("./text_highlight_rules").TextHighlightRules,i="\\\\(?:[\\\\0abtrn;#=:]|x[a-fA-F\\d]{4})",t=function(){this.$rules={start:[{token:"punctuation.definition.comment.ini",regex:"#.*",push_:[{token:"comment.line.number-sign.ini",regex:"$|^",next:"pop"},{defaultToken:"comment.line.number-sign.ini"}]},{token:"punctuation.definition.comment.ini",regex:";.*",push_:[{token:"comment.line.semicolon.ini",regex:"$|^",next:"pop"},{defaultToken:"comment.line.semicolon.ini"}]},{token:["keyword.other.definition.ini","text","punctuation.separator.key-value.ini"],regex:"\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)"},{token:["punctuation.definition.entity.ini","constant.section.group-title.ini","punctuation.definition.entity.ini"],regex:"^(\\[)(.*?)(\\])"},{token:"punctuation.definition.string.begin.ini",regex:"'",push:[{token:"punctuation.definition.string.end.ini",regex:"'",next:"pop"},{token:"constant.language.escape",regex:i},{defaultToken:"string.quoted.single.ini"}]},{token:"punctuation.definition.string.begin.ini",regex:'"',push:[{token:"constant.language.escape",regex:i},{token:"punctuation.definition.string.end.ini",regex:'"',next:"pop"},{defaultToken:"string.quoted.double.ini"}]}]},this.normalizeRules()};t.metaData={fileTypes:["ini","conf"],keyEquivalent:"^~I",name:"Ini",scopeName:"source.ini"},n.inherits(t,e),exports.IniHighlightRules=t});
//# sourceMappingURL=../sourcemaps/mode/ini_highlight_rules.js.map
