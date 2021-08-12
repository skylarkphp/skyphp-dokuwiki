define([
	"./i18n",
	"./Translator"
],function(i18n,Translator){
	/**
	 * Legacy translator function for backwards compatibility
	 */
	function translate(text, language, callback) {
		// TODO: deprecate?

		var cb = callback;
		var lang = language;
		if (typeof language === 'function') {
			cb = language;
			lang = null;
		}

		if (!(typeof text === 'string' || text instanceof String) || text === '') {
			return cb('');
		}

		return Translator.create(lang).translate(text).then(function (output) {
			if (cb) {
				setTimeout(cb, 0, output);
			}
			return output;
		}, function (err) {
			console.warn('Translation failed: ' + err.stack);
		});
	}

	return i18n.translate = translate;
	
});