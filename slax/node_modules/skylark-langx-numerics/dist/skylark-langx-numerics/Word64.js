/**
 * skylark-langx-numerics - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){function h(h,i){this.high=0|h,this.low=0|i}return h.prototype={and:function(h){this.high&=h.high,this.low&=h.low},xor:function(h){this.high^=h.high,this.low^=h.low},or:function(h){this.high|=h.high,this.low|=h.low},shiftRight:function(h){h>=32?(this.low=this.high>>>h-32|0,this.high=0):(this.low=this.low>>>h|this.high<<32-h,this.high=this.high>>>h|0)},shiftLeft:function(h){h>=32?(this.high=this.low<<h-32,this.low=0):(this.high=this.high<<h|this.low>>>32-h,this.low=this.low<<h)},rotateRight:function(h){var i,t;32&h?(t=this.low,i=this.high):(i=this.low,t=this.high),h&=31,this.low=i>>>h|t<<32-h,this.high=t>>>h|i<<32-h},not:function(){this.high=~this.high,this.low=~this.low},add:function(h){var i=(this.low>>>0)+(h.low>>>0),t=(this.high>>>0)+(h.high>>>0);i>4294967295&&(t+=1),this.low=0|i,this.high=0|t},copyTo:function(h,i){h[i]=this.high>>>24&255,h[i+1]=this.high>>16&255,h[i+2]=this.high>>8&255,h[i+3]=255&this.high,h[i+4]=this.low>>>24&255,h[i+5]=this.low>>16&255,h[i+6]=this.low>>8&255,h[i+7]=255&this.low},assign:function(h){this.high=h.high,this.low=h.low}},h});
//# sourceMappingURL=sourcemaps/word64.js.map
