/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("../../lib/oop"),g=e("./fold_mode").FoldMode,r=e("../../range").Range,a=t.FoldMode=function(){};n.inherits(a,g),function(){this.foldingStartMarker=/^(?:\|={10,}|[\.\/=\-~^+]{4,}\s*$|={1,5} )/,this.singleLineHeadingRe=/^={1,5}(?=\s+\S)/,this.getFoldWidget=function(e,t,i){var n=e.getLine(i);return this.foldingStartMarker.test(n)?"="==n[0]?this.singleLineHeadingRe.test(n)?"start":e.getLine(i-1).length!=e.getLine(i).length?"":"start":"dissallowDelimitedBlock"==e.bgTokenizer.getState(i)?"end":"start":""},this.getFoldWidgetRange=function(e,t,i){var n=e.getLine(i),g=n.length,a=e.getLength(),l=i,o=i;if(n.match(this.foldingStartMarker)){var s,d=["=","-","~","^","+"],f=this.singleLineHeadingRe;if("markup.heading"==c(i)){for(var h=k();++i<a;){if("markup.heading"==c(i))if(k()<=h)break}if((o=s&&s.value.match(this.singleLineHeadingRe)?i-1:i-2)>l)for(;o>l&&(!c(o)||"["==s.value[0]);)o--;if(o>l){var u=e.getLine(o).length;return new r(l,g,o,u)}}else{if("dissallowDelimitedBlock"==e.bgTokenizer.getState(i)){for(;i-- >0&&-1!=e.bgTokenizer.getState(i).lastIndexOf("Block"););if((o=i+1)<l){u=e.getLine(i).length;return new r(o,5,l,g-5)}}else{for(;++i<a&&"dissallowDelimitedBlock"!=e.bgTokenizer.getState(i););if((o=i)>l){u=e.getLine(i).length;return new r(l,5,o,u-5)}}}}function c(t){return(s=e.getTokens(t)[0])&&s.type}function k(){var t=s.value.match(f);if(t)return t[0].length;var n=d.indexOf(s.value[0])+1;return 1==n&&e.getLine(i-1).length!=e.getLine(i).length?1/0:n}}}.call(a.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/asciidoc.js.map
