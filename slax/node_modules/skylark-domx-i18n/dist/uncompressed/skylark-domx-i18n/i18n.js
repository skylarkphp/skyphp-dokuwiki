define([
	"skylark-langx/skylark",
	"skylark-domx-query",
	"skylark-domx-data",
	"skylark-domx-styler"	
],function(skylark){
	return skylark.attach("domx.i18n",{
		/**
		 * Escape translator patterns in text
		 * @param {string} text
		 * @returns {string}
		 */
		escape : function escape(text) {
			return typeof text === 'string' ? text.replace(/\[\[/g, '&lsqb;&lsqb;').replace(/\]\]/g, '&rsqb;&rsqb;') : text;
		},

		/**
		 * Unescape escaped translator patterns in text
		 * @param {string} text
		 * @returns {string}
		 */
		unescape : function unescape(text) {
			return typeof text === 'string' ? text.replace(/&lsqb;|\\\[/g, '[').replace(/&rsqb;|\\\]/g, ']') : text;
		},

		/**
		 * Construct a translator pattern
		 * @param {string} name - Translation name
		 * @param {...string} arg - Optional argument for the pattern
		 */
		compile : function compile() {
			var args = Array.prototype.slice.call(arguments, 0).map(function (text) {
				// escape commas and percent signs in arguments
				return String(text).replace(/%/g, '&#37;').replace(/,/g, '&#44;');
			});

			return '[[' + args.join(', ') + ']]';
		}
	});
});