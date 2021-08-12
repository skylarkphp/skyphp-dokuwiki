define([
	"skylark-domx-query",
	"./i18n",
	"./Translator"
],function($,i18n,Translator){

	/**
	 * Add translations to the cache
	 */
	return i18n.addTranslation = function addTranslation(language, namespace, translation) {
		Translator.create(language).getTranslation(namespace).then(function (translations) {
			assign(translations, translation);
		});
	};
	
});