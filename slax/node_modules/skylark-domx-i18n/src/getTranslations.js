define([
	"skylark-domx-query",
	"./i18n",
	"./Translator"
],function($,i18n,Translator){

	/**
	 * Get the translations object
	 */
	return i18n.getTranslations =  function getTranslations(language, namespace, callback) {
		callback = callback || function () {};
		Translator.create(language).getTranslation(namespace).then(callback);
	};
	
});