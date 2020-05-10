/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),t=require("../../range").Range,i=require("./cstyle").FoldMode,n=exports.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};e.inherits(n,i),function(){this.usingRe=/^\s*using \S/,this.getFoldWidgetRangeBase=this.getFoldWidgetRange,this.getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,i){var n=this.getFoldWidgetBase(e,t,i);if(!n){var g=e.getLine(i);if(/^\s*#region\b/.test(g))return"start";var s=this.usingRe;if(s.test(g)){var r=e.getLine(i-1),o=e.getLine(i+1);if(!s.test(r)&&s.test(o))return"start"}}return n},this.getFoldWidgetRange=function(e,t,i){var n=this.getFoldWidgetRangeBase(e,t,i);if(n)return n;var g=e.getLine(i);return this.usingRe.test(g)?this.getUsingStatementBlock(e,g,i):/^\s*#region\b/.test(g)?this.getRegionBlock(e,g,i):void 0},this.getUsingStatementBlock=function(e,i,n){for(var g=i.match(this.usingRe)[0].length-1,s=e.getLength(),r=n,o=n;++n<s;)if(i=e.getLine(n),!/^\s*$/.test(i)){if(!this.usingRe.test(i))break;o=n}if(o>r){var a=e.getLine(o).length;return new t(r,g,o,a)}},this.getRegionBlock=function(e,i,n){for(var g=i.search(/\s*$/),s=e.getLength(),r=n,o=/^\s*#(end)?region\b/,a=1;++n<s;){i=e.getLine(n);var h=o.exec(i);if(h&&(h[1]?a--:a++,!a))break}if(n>r)return new t(r,g,n,i.length)}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/csharp.js.map
