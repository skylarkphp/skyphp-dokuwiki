/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("../../lib/oop"),g=e("../../range").Range,s=e("./cstyle").FoldMode,r=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};n.inherits(r,s),function(){this.usingRe=/^\s*using \S/,this.getFoldWidgetRangeBase=this.getFoldWidgetRange,this.getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,i){var n=this.getFoldWidgetBase(e,t,i);if(!n){var g=e.getLine(i);if(/^\s*#region\b/.test(g))return"start";var s=this.usingRe;if(s.test(g)){var r=e.getLine(i-1),o=e.getLine(i+1);if(!s.test(r)&&s.test(o))return"start"}}return n},this.getFoldWidgetRange=function(e,t,i){var n=this.getFoldWidgetRangeBase(e,t,i);if(n)return n;var g=e.getLine(i);return this.usingRe.test(g)?this.getUsingStatementBlock(e,g,i):/^\s*#region\b/.test(g)?this.getRegionBlock(e,g,i):void 0},this.getUsingStatementBlock=function(e,t,i){for(var n=t.match(this.usingRe)[0].length-1,s=e.getLength(),r=i,o=i;++i<s;)if(t=e.getLine(i),!/^\s*$/.test(t)){if(!this.usingRe.test(t))break;o=i}if(o>r){var a=e.getLine(o).length;return new g(r,n,o,a)}},this.getRegionBlock=function(e,t,i){for(var n=t.search(/\s*$/),s=e.getLength(),r=i,o=/^\s*#(end)?region\b/,a=1;++i<s;){t=e.getLine(i);var h=o.exec(t);if(h&&(h[1]?a--:a++,!a))break}if(i>r)return new g(r,n,i,t.length)}}.call(r.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/csharp.js.map
