/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./javascript_highlight_rules").JavaScriptHighlightRules,r=function(e){var r=new t({jsx:1==(e&&e.jsx)}).getRules();r.no_regex=[{token:["storage.type","text","entity.name.function.ts"],regex:"(function)(\\s+)([a-zA-Z0-9$_¡-￿][a-zA-Z0-9d$_¡-￿]*)"},{token:"keyword",regex:"(?:\\b(constructor|declare|interface|as|AS|public|private|extends|export|super|readonly|module|namespace|abstract|implements)\\b)"},{token:["keyword","storage.type.variable.ts"],regex:"(class|type)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*)"},{token:"keyword",regex:"\\b(?:super|export|import|keyof|infer)\\b"},{token:["storage.type.variable.ts"],regex:"(?:\\b(this\\.|string\\b|bool\\b|boolean\\b|number\\b|true\\b|false\\b|undefined\\b|any\\b|null\\b|(?:unique )?symbol\\b|object\\b|never\\b|enum\\b))"}].concat(r.no_regex),this.$rules=r};e.inherits(r,t),exports.TypeScriptHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/typescript_highlight_rules.js.map
