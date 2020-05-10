/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("./range").Range,n=function(t,n,e){this.$session=t,this.$row=n,this.$rowTokens=t.getTokens(n);var o=t.getTokenAt(n,e);this.$tokenIndex=o?o.index:-1};(function(){this.stepBackward=function(){for(this.$tokenIndex-=1;this.$tokenIndex<0;){if(this.$row-=1,this.$row<0)return this.$row=0,null;this.$rowTokens=this.$session.getTokens(this.$row),this.$tokenIndex=this.$rowTokens.length-1}return this.$rowTokens[this.$tokenIndex]},this.stepForward=function(){var t;for(this.$tokenIndex+=1;this.$tokenIndex>=this.$rowTokens.length;){if(this.$row+=1,t||(t=this.$session.getLength()),this.$row>=t)return this.$row=t-1,null;this.$rowTokens=this.$session.getTokens(this.$row),this.$tokenIndex=0}return this.$rowTokens[this.$tokenIndex]},this.getCurrentToken=function(){return this.$rowTokens[this.$tokenIndex]},this.getCurrentTokenRow=function(){return this.$row},this.getCurrentTokenColumn=function(){var t=this.$rowTokens,n=this.$tokenIndex,e=t[n].start;if(void 0!==e)return e;for(e=0;n>0;)e+=t[n-=1].value.length;return e},this.getCurrentTokenPosition=function(){return{row:this.$row,column:this.getCurrentTokenColumn()}},this.getCurrentTokenRange=function(){var n=this.$rowTokens[this.$tokenIndex],e=this.getCurrentTokenColumn();return new t(this.$row,e,this.$row,e+n.value.length)}}).call(n.prototype),exports.TokenIterator=n});
//# sourceMappingURL=sourcemaps/token_iterator.js.map
