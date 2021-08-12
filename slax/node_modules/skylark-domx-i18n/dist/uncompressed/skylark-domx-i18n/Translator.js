define([
	"skylark-langx/langx",
	"./i18n"
],function(langx,i18n) {
	var HTMLEntities = Object.freeze({
		amp: '&',
		gt: '>',
		lt: '<',
		quot: '"',
		apos: "'",
		AElig: 198,
		Aacute: 193,
		Acirc: 194,
		Agrave: 192,
		Aring: 197,
		Atilde: 195,
		Auml: 196,
		Ccedil: 199,
		ETH: 208,
		Eacute: 201,
		Ecirc: 202,
		Egrave: 200,
		Euml: 203,
		Iacute: 205,
		Icirc: 206,
		Igrave: 204,
		Iuml: 207,
		Ntilde: 209,
		Oacute: 211,
		Ocirc: 212,
		Ograve: 210,
		Oslash: 216,
		Otilde: 213,
		Ouml: 214,
		THORN: 222,
		Uacute: 218,
		Ucirc: 219,
		Ugrave: 217,
		Uuml: 220,
		Yacute: 221,
		aacute: 225,
		acirc: 226,
		aelig: 230,
		agrave: 224,
		aring: 229,
		atilde: 227,
		auml: 228,
		ccedil: 231,
		eacute: 233,
		ecirc: 234,
		egrave: 232,
		eth: 240,
		euml: 235,
		iacute: 237,
		icirc: 238,
		igrave: 236,
		iuml: 239,
		ntilde: 241,
		oacute: 243,
		ocirc: 244,
		ograve: 242,
		oslash: 248,
		otilde: 245,
		ouml: 246,
		szlig: 223,
		thorn: 254,
		uacute: 250,
		ucirc: 251,
		ugrave: 249,
		uuml: 252,
		yacute: 253,
		yuml: 255,
		copy: 169,
		reg: 174,
		nbsp: 160,
		iexcl: 161,
		cent: 162,
		pound: 163,
		curren: 164,
		yen: 165,
		brvbar: 166,
		sect: 167,
		uml: 168,
		ordf: 170,
		laquo: 171,
		not: 172,
		shy: 173,
		macr: 175,
		deg: 176,
		plusmn: 177,
		sup1: 185,
		sup2: 178,
		sup3: 179,
		acute: 180,
		micro: 181,
		para: 182,
		middot: 183,
		cedil: 184,
		ordm: 186,
		raquo: 187,
		frac14: 188,
		frac12: 189,
		frac34: 190,
		iquest: 191,
		times: 215,
		divide: 247,
		'OElig;': 338,
		'oelig;': 339,
		'Scaron;': 352,
		'scaron;': 353,
		'Yuml;': 376,
		'fnof;': 402,
		'circ;': 710,
		'tilde;': 732,
		'Alpha;': 913,
		'Beta;': 914,
		'Gamma;': 915,
		'Delta;': 916,
		'Epsilon;': 917,
		'Zeta;': 918,
		'Eta;': 919,
		'Theta;': 920,
		'Iota;': 921,
		'Kappa;': 922,
		'Lambda;': 923,
		'Mu;': 924,
		'Nu;': 925,
		'Xi;': 926,
		'Omicron;': 927,
		'Pi;': 928,
		'Rho;': 929,
		'Sigma;': 931,
		'Tau;': 932,
		'Upsilon;': 933,
		'Phi;': 934,
		'Chi;': 935,
		'Psi;': 936,
		'Omega;': 937,
		'alpha;': 945,
		'beta;': 946,
		'gamma;': 947,
		'delta;': 948,
		'epsilon;': 949,
		'zeta;': 950,
		'eta;': 951,
		'theta;': 952,
		'iota;': 953,
		'kappa;': 954,
		'lambda;': 955,
		'mu;': 956,
		'nu;': 957,
		'xi;': 958,
		'omicron;': 959,
		'pi;': 960,
		'rho;': 961,
		'sigmaf;': 962,
		'sigma;': 963,
		'tau;': 964,
		'upsilon;': 965,
		'phi;': 966,
		'chi;': 967,
		'psi;': 968,
		'omega;': 969,
		'thetasym;': 977,
		'upsih;': 978,
		'piv;': 982,
		'ensp;': 8194,
		'emsp;': 8195,
		'thinsp;': 8201,
		'zwnj;': 8204,
		'zwj;': 8205,
		'lrm;': 8206,
		'rlm;': 8207,
		'ndash;': 8211,
		'mdash;': 8212,
		'lsquo;': 8216,
		'rsquo;': 8217,
		'sbquo;': 8218,
		'ldquo;': 8220,
		'rdquo;': 8221,
		'bdquo;': 8222,
		'dagger;': 8224,
		'Dagger;': 8225,
		'bull;': 8226,
		'hellip;': 8230,
		'permil;': 8240,
		'prime;': 8242,
		'Prime;': 8243,
		'lsaquo;': 8249,
		'rsaquo;': 8250,
		'oline;': 8254,
		'frasl;': 8260,
		'euro;': 8364,
		'image;': 8465,
		'weierp;': 8472,
		'real;': 8476,
		'trade;': 8482,
		'alefsym;': 8501,
		'larr;': 8592,
		'uarr;': 8593,
		'rarr;': 8594,
		'darr;': 8595,
		'harr;': 8596,
		'crarr;': 8629,
		'lArr;': 8656,
		'uArr;': 8657,
		'rArr;': 8658,
		'dArr;': 8659,
		'hArr;': 8660,
		'forall;': 8704,
		'part;': 8706,
		'exist;': 8707,
		'empty;': 8709,
		'nabla;': 8711,
		'isin;': 8712,
		'notin;': 8713,
		'ni;': 8715,
		'prod;': 8719,
		'sum;': 8721,
		'minus;': 8722,
		'lowast;': 8727,
		'radic;': 8730,
		'prop;': 8733,
		'infin;': 8734,
		'ang;': 8736,
		'and;': 8743,
		'or;': 8744,
		'cap;': 8745,
		'cup;': 8746,
		'int;': 8747,
		'there4;': 8756,
		'sim;': 8764,
		'cong;': 8773,
		'asymp;': 8776,
		'ne;': 8800,
		'equiv;': 8801,
		'le;': 8804,
		'ge;': 8805,
		'sub;': 8834,
		'sup;': 8835,
		'nsub;': 8836,
		'sube;': 8838,
		'supe;': 8839,
		'oplus;': 8853,
		'otimes;': 8855,
		'perp;': 8869,
		'sdot;': 8901,
		'lceil;': 8968,
		'rceil;': 8969,
		'lfloor;': 8970,
		'rfloor;': 8971,
		'lang;': 9001,
		'rang;': 9002,
		'loz;': 9674,
		'spades;': 9824,
		'clubs;': 9827,
		'hearts;': 9829,
		'diams;': 9830,
	});

	// https://github.com/substack/node-ent/blob/master/index.js
	function decodeHTMLEntities(html) {
		return String(html)
			.replace(/&#(\d+);?/g, function (_, code) {
				return String.fromCharCode(code);
			})
			.replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
				return String.fromCharCode(parseInt(hex, 16));
			})
			.replace(/&([^;\W]+;?)/g, function (m, e) {
				var ee = e.replace(/;$/, '');
				var target = HTMLEntities[e] || (e.match(/;$/) && HTMLEntities[ee]);

				if (typeof target === 'number') {
					return String.fromCharCode(target);
				} else if (typeof target === 'string') {
					return target;
				}

				return m;
			});
	}	

	function escapeHTML(str) {
		return langx.escapeHTML(decodeHTMLEntities(
			String(str)
				.replace(/[\s\xa0]+/g, ' ')
				.replace(/^\s+|\s+$/g, '')
		));
	}

	//function load(language, namespace) {
	//	return Promise.resolve(jQuery.getJSON(config.relative_path + '/assets/language/' + language + '/' + namespace + '.json?' + config['cache-buster']));
	//}

	var warn = function () { console.warn.apply(console, arguments); };

	var assign = Object.assign || jQuery.extend;


	/**
	 * Construct a new Translator object
	 * @param {string} language - Language code for this translator instance
	 * @exports translator.Translator
	 */
	function Translator(language,load) {
		var self = this;

		if (!language) {
			throw new TypeError('Parameter `language` must be a language string. Received ' + language + (language === '' ? '(empty string)' : ''));
		}

		self.modules = Object.keys(Translator.moduleFactories).map(function (namespace) {
			var factory = Translator.moduleFactories[namespace];
			return [namespace, factory(language)];
		}).reduce(function (prev, elem) {
			var namespace = elem[0];
			var module = elem[1];
			prev[namespace] = module;

			return prev;
		}, {});

		self.lang = language;
		self.translations = {};
		self.load = load;
	}

	//Translator.prototype.load = load;

	/**
	 * Parse the translation instructions into the language of the Translator instance
	 * @param {string} str - Source string
	 * @returns {Promise<string>}
	 */
	Translator.prototype.translate = function translate(str) {
		// regex for valid text in namespace / key
		var validText = 'a-zA-Z0-9\\-_.\\/';
		var validTextRegex = new RegExp('[' + validText + ']');
		var invalidTextRegex = new RegExp('[^' + validText + '\\]]');

		// current cursor position
		var cursor = 0;
		// last break of the input string
		var lastBreak = 0;
		// length of the input string
		var len = str.length;
		// array to hold the promises for the translations
		// and the strings of untranslated text in between
		var toTranslate = [];

		// to store the state of if we're currently in a top-level token for later
		var inToken = false;

		// split a translator string into an array of tokens
		// but don't split by commas inside other translator strings
		function split(text) {
			var len = text.length;
			var arr = [];
			var i = 0;
			var brk = 0;
			var level = 0;

			while (i + 2 <= len) {
				if (text[i] === '[' && text[i + 1] === '[') {
					level += 1;
					i += 1;
				} else if (text[i] === ']' && text[i + 1] === ']') {
					level -= 1;
					i += 1;
				} else if (level === 0 && text[i] === ',' && text[i - 1] !== '\\') {
					arr.push(text.slice(brk, i).trim());
					i += 1;
					brk = i;
				}
				i += 1;
			}
			arr.push(text.slice(brk, i + 1).trim());
			return arr;
		}

		// move to the first [[
		cursor = str.indexOf('[[', cursor);

		// the loooop, we'll go to where the cursor
		// is equal to the length of the string since
		// slice doesn't include the ending index
		while (cursor + 2 <= len && cursor !== -1) {
			// split the string from the last break
			// to the character before the cursor
			// add that to the result array
			toTranslate.push(str.slice(lastBreak, cursor));
			// set the cursor position past the beginning
			// brackets of the translation string
			cursor += 2;
			// set the last break to our current
			// spot since we just broke the string
			lastBreak = cursor;
			// we're in a token now
			inToken = true;

			// the current level of nesting of the translation strings
			var level = 0;
			var char0;
			var char1;
			// validating the current string is actually a translation
			var textBeforeColonFound = false;
			var colonFound = false;
			var textAfterColonFound = false;
			var commaAfterNameFound = false;

			while (cursor + 2 <= len) {
				char0 = str[cursor];
				char1 = str[cursor + 1];
				// found some text after the double bracket,
				// so this is probably a translation string
				if (!textBeforeColonFound && validTextRegex.test(char0)) {
					textBeforeColonFound = true;
					cursor += 1;
				// found a colon, so this is probably a translation string
				} else if (textBeforeColonFound && !colonFound && char0 === ':') {
					colonFound = true;
					cursor += 1;
				// found some text after the colon,
				// so this is probably a translation string
				} else if (colonFound && !textAfterColonFound && validTextRegex.test(char0)) {
					textAfterColonFound = true;
					cursor += 1;
				} else if (textAfterColonFound && !commaAfterNameFound && char0 === ',') {
					commaAfterNameFound = true;
					cursor += 1;
				// a space or comma was found before the name
				// this isn't a translation string, so back out
				} else if (!(textBeforeColonFound && colonFound && textAfterColonFound && commaAfterNameFound) &&
						invalidTextRegex.test(char0)) {
					cursor += 1;
					lastBreak -= 2;
					// no longer in a token
					inToken = false;
					if (level > 0) {
						level -= 1;
					} else {
						break;
					}
				// if we're at the beginning of another translation string,
				// we're nested, so add to our level
				} else if (char0 === '[' && char1 === '[') {
					level += 1;
					cursor += 2;
				// if we're at the end of a translation string
				} else if (char0 === ']' && char1 === ']') {
					// if we're at the base level, then this is the end
					if (level === 0) {
						// so grab the name and args
						var currentSlice = str.slice(lastBreak, cursor);
						var result = split(currentSlice);
						var name = result[0];
						var args = result.slice(1);

						// make a backup based on the raw string of the token
						// if there are arguments to the token
						var backup = '';
						if (args && args.length) {
							backup = this.translate(currentSlice);
						}
						// add the translation promise to the array
						toTranslate.push(this.translateKey(name, args, backup));
						// skip past the ending brackets
						cursor += 2;
						// set this as our last break
						lastBreak = cursor;
						// and we're no longer in a translation string,
						// so continue with the main loop
						inToken = false;
						break;
					}
					// otherwise we lower the level
					level -= 1;
					// and skip past the ending brackets
					cursor += 2;
				} else {
					// otherwise just move to the next character
					cursor += 1;
				}
			}

			// skip to the next [[
			cursor = str.indexOf('[[', cursor);
		}

		// ending string of source
		var last = str.slice(lastBreak);

		// if we were mid-token, treat it as invalid
		if (inToken) {
			last = this.translate(last);
		}

		// add the remaining text after the last translation string
		toTranslate.push(last);

		// and return a promise for the concatenated translated string
		return Promise.all(toTranslate).then(function (translated) {
			return translated.join('');
		});
	};

	/**
	 * Translates a specific key and array of arguments
	 * @param {string} name - Translation key (ex. 'global:home')
	 * @param {string[]} args - Arguments for `%1`, `%2`, etc
	 * @param {string|Promise<string>} backup - Text to use in case the key can't be found
	 * @returns {Promise<string>}
	 */
	Translator.prototype.translateKey = function translateKey(name, args, backup) {
		var self = this;

		var result = name.split(':', 2);
		var namespace = result[0];
		var key = result[1];

		if (self.modules[namespace]) {
			return Promise.resolve(self.modules[namespace](key, args));
		}

		if (namespace && !key) {
			warn('Missing key in translation token "' + name + '"');
			return Promise.resolve('[[' + namespace + ']]');
		}

		var translation = this.getTranslation(namespace, key);
		return translation.then(function (translated) {
			// check if the translation is missing first
			if (!translated) {
				warn('Missing translation "' + name + '"');
				return backup || key;
			}

			var argsToTranslate = args.map(function (arg) {
				return self.translate(escapeHTML(arg));
			});

			return Promise.all(argsToTranslate).then(function (translatedArgs) {
				var out = translated;
				translatedArgs.forEach(function (arg, i) {
					var escaped = arg.replace(/%(?=\d)/g, '&#37;').replace(/\\,/g, '&#44;');
					out = out.replace(new RegExp('%' + (i + 1), 'g'), escaped);
				});
				return out;
			});
		});
	};

	/**
	 * Load translation file (or use a cached version), and optionally return the translation of a certain key
	 * @param {string} namespace - The file name of the translation namespace
	 * @param {string} [key] - The key of the specific translation to getJSON
	 * @returns {Promise<{ [key: string]: string } | string>}
	 */
	Translator.prototype.getTranslation = function getTranslation(namespace, key) {
		var translation;
		if (!namespace) {
			warn('[translator] Parameter `namespace` is ' + namespace + (namespace === '' ? '(empty string)' : ''));
			translation = Promise.resolve({});
		} else {
			this.translations[namespace] = this.translations[namespace] || this.load(this.lang, namespace).catch(function () { return {}; });
			translation = this.translations[namespace];
		}

		if (key) {
			return translation.then(function (x) {
				return x && x[key]; // modified by lwf
			});
		}
		return translation;
	};

	/**
	 * @param {Node} node
	 * @returns {Node[]}
	 */
	function descendantTextNodes(node) {
		var textNodes = [];

		function helper(node) {
			if (node.nodeType === 3) {
				textNodes.push(node);
			} else {
				for (var i = 0, c = node.childNodes, l = c.length; i < l; i += 1) {
					helper(c[i]);
				}
			}
		}

		helper(node);
		return textNodes;
	}

	/**
	 * Recursively translate a DOM element in place
	 * @param {Element} element - Root element to translate
	 * @param {string[]} [attributes] - Array of node attributes to translate
	 * @returns {Promise<void>}
	 */
	Translator.prototype.translateInPlace = function translateInPlace(element, attributes) {
		attributes = attributes || ['placeholder', 'title'];

		var nodes = descendantTextNodes(element);
		var text = nodes.map(function (node) {
			return node.nodeValue;
		}).join('  ||  ');

		var attrNodes = attributes.reduce(function (prev, attr) {
			var tuples = Array.prototype.map.call(element.querySelectorAll('[' + attr + '*="[["]'), function (el) {
				return [attr, el];
			});
			return prev.concat(tuples);
		}, []);
		var attrText = attrNodes.map(function (node) {
			return node[1].getAttribute(node[0]);
		}).join('  ||  ');

		return Promise.all([
			this.translate(text),
			this.translate(attrText),
		]).then(function (ref) {
			var translated = ref[0];
			var translatedAttrs = ref[1];
			if (translated) {
				translated.split('  ||  ').forEach(function (html, i) {
					$(nodes[i]).replaceWith(html);
				});
			}
			if (translatedAttrs) {
				translatedAttrs.split('  ||  ').forEach(function (text, i) {
					attrNodes[i][1].setAttribute(attrNodes[i][0], text);
				});
			}
		});
	};

	/**
	 * Get the language of the current environment, falling back to defaults
	 * @returns {string}
	 */
	Translator.getLanguage = function getLanguage() {
		//var lang;
		//if (typeof window === 'object' && window.config && window.utils) {
		//	lang = utils.params().lang || config.userLang || config.defaultLang || 'en-GB';
		//} else {
		//	var meta = require('./meta');
		//	lang = meta.config && meta.config.defaultLang ? meta.config.defaultLang : 'en-GB';
		//}
		//return lang;

		return 'en-GB';
	};

	/**
	 * Create and cache a new Translator instance, or return a cached one
	 * @param {string} [language] - ('en-GB') Language string
	 * @returns {Translator}
	 */
	Translator.create = function create(language) {
		if (!language) {
			language = Translator.getLanguage();
		}

		Translator.cache[language] = Translator.cache[language] || new Translator(language);

		return Translator.cache[language];
	};

	Translator.cache = {};

	/**
	 * Register a custom module to handle translations
	 * @param {string} namespace - Namespace to handle translation for
	 * @param {Function} factory - Function to return the translation function for this namespace
	 */
	Translator.registerModule = function registerModule(namespace, factory) {
		Translator.moduleFactories[namespace] = factory;

		Object.keys(Translator.cache).forEach(function (key) {
			var translator = Translator.cache[key];
			translator.modules[namespace] = factory(translator.lang);
		});
	};

	Translator.moduleFactories = {};

	/**
	 * Remove the translator patterns from text
	 * @param {string} text
	 * @returns {string}
	 */
	Translator.removePatterns = function removePatterns(text) {
		var len = text.length;
		var cursor = 0;
		var lastBreak = 0;
		var level = 0;
		var out = '';
		var sub;

		while (cursor < len) {
			sub = text.slice(cursor, cursor + 2);
			if (sub === '[[') {
				if (level === 0) {
					out += text.slice(lastBreak, cursor);
				}
				level += 1;
				cursor += 2;
			} else if (sub === ']]') {
				level -= 1;
				cursor += 2;
				if (level === 0) {
					lastBreak = cursor;
				}
			} else {
				cursor += 1;
			}
		}
		out += text.slice(lastBreak, cursor);
		return out;
	};


	return i18n.Translator = Translator;


});