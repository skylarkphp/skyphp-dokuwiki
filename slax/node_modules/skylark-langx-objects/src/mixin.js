define([
	"skylark-langx-types",
	"./objects",
  "./_mixin",
  "./_parse_mixin_args"
],function(types,objects,_mixin,_parseMixinArgs) {


    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }


    return objects.mixin = mixin;
	
});