/**
 * skylark-domx-i18n - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-domx-query","skylark-domx-data","skylark-domx-styler"],function(r){return r.attach("domx.i18n",{escape:function(r){return"string"==typeof r?r.replace(/\[\[/g,"&lsqb;&lsqb;").replace(/\]\]/g,"&rsqb;&rsqb;"):r},unescape:function(r){return"string"==typeof r?r.replace(/&lsqb;|\\\[/g,"[").replace(/&rsqb;|\\\]/g,"]"):r},compile:function(){return"[["+Array.prototype.slice.call(arguments,0).map(function(r){return String(r).replace(/%/g,"&#37;").replace(/,/g,"&#44;")}).join(", ")+"]]"}})});
//# sourceMappingURL=sourcemaps/i18n.js.map
