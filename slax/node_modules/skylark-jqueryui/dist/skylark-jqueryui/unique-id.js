/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","./version"],function(i){return i.fn.extend({uniqueId:(n=0,function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})}),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&i(this).removeAttr("id")})}});var n});
//# sourceMappingURL=sourcemaps/unique-id.js.map
