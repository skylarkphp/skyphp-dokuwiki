define([
	"skylark-domx-query",
	"./i18n",
	"./translate"
],function($,i18n,translate){

	return i18n.prepareDOM = function prepareDOM() {
		// Add directional code if necessary
		translate('[[language:dir]]', function (value) {
			if (value && !$('html').attr('data-dir')) {
				$('html').css('direction', value).attr('data-dir', value);
			}
		});
	};
	
});