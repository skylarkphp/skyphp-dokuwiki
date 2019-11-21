/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";t("../token_iterator").TokenIterator;var r=["abstract","as","base","bool","break","byte","case","catch","char","checked","class","const","continue","decimal","default","delegate","do","double","else","enum","event","explicit","extern","false","finally","fixed","float","for","foreach","goto","if","implicit","in","int","interface","internal","is","lock","long","namespace","new","null","object","operator","out","override","params","private","protected","public","readonly","ref","return","sbyte","sealed","short","sizeof","stackalloc","static","string","struct","switch","this","throw","true","try","typeof","uint","ulong","unchecked","unsafe","ushort","using","var","virtual","void","volatile","while"],n=["Html","Model","Url","Layout"],a=function(){};(function(){this.getCompletions=function(t,e,o,r){return-1==t.lastIndexOf("razor-short-start")&&-1==t.lastIndexOf("razor-block-start")?[]:e.getTokenAt(o.row,o.column)?-1!=t.lastIndexOf("razor-short-start")?this.getShortStartCompletions(t,e,o,r):-1!=t.lastIndexOf("razor-block-start")?this.getKeywordCompletions(t,e,o,r):void 0:[]},this.getShortStartCompletions=function(t,e,o,r){return n.map(function(t){return{value:t,meta:"keyword",score:1e6}})},this.getKeywordCompletions=function(t,e,o,a){return n.concat(r).map(function(t){return{value:t,meta:"keyword",score:1e6}})}}).call(a.prototype),e.RazorCompletions=a});
//# sourceMappingURL=../sourcemaps/mode/razor_completions.js.map
