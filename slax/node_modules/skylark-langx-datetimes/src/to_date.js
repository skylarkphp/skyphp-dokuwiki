define([
	"skylark-langx-types",
    "./datetimes"
],function(types,datetimes){

//original :pdf.js-2.7.750/src/display/display_utils.js

  /**
class PDFDateString {
   * Convert a PDF date string to a JavaScript `Date` object.
   *
   * The PDF date string format is described in section 7.9.4 of the official
   * PDF 32000-1:2008 specification. However, in the PDF 1.7 reference (sixth
   * edition) Adobe describes the same format including a trailing apostrophe.
   * This syntax in incorrect, but Adobe Acrobat creates PDF files that contain
   * them. We ignore all apostrophes as they are not necessary for date parsing.
   *
   * Moreover, Adobe Acrobat doesn't handle changing the date to universal time
   * and doesn't use the user's time zone (effectively ignoring the HH' and mm'
   * parts of the date string).
   *
   * @param {string} input
   * @returns {Date|null}
   *
  static toDateObject(input) {
   **/


	let pdfDateStringRegex;

	function toDate(input) {
    if (!input || !types.isString(input)) {
      return null;
    }

    // Lazily initialize the regular expression.
    if (!pdfDateStringRegex) {
      pdfDateStringRegex = new RegExp(
        "^D:" + // Prefix (required)
          "(\\d{4})" + // Year (required)
          "(\\d{2})?" + // Month (optional)
          "(\\d{2})?" + // Day (optional)
          "(\\d{2})?" + // Hour (optional)
          "(\\d{2})?" + // Minute (optional)
          "(\\d{2})?" + // Second (optional)
          "([Z|+|-])?" + // Universal time relation (optional)
          "(\\d{2})?" + // Offset hour (optional)
          "'?" + // Splitting apostrophe (optional)
          "(\\d{2})?" + // Offset minute (optional)
          "'?" // Trailing apostrophe (optional)
      );
    }

    // Optional fields that don't satisfy the requirements from the regular
    // expression (such as incorrect digit counts or numbers that are out of
    // range) will fall back the defaults from the specification.
    const matches = pdfDateStringRegex.exec(input);
    if (!matches) {
      return null;
    }

    // JavaScript's `Date` object expects the month to be between 0 and 11
    // instead of 1 and 12, so we have to correct for that.
    const year = parseInt(matches[1], 10);
    let month = parseInt(matches[2], 10);
    month = month >= 1 && month <= 12 ? month - 1 : 0;
    let day = parseInt(matches[3], 10);
    day = day >= 1 && day <= 31 ? day : 1;
    let hour = parseInt(matches[4], 10);
    hour = hour >= 0 && hour <= 23 ? hour : 0;
    let minute = parseInt(matches[5], 10);
    minute = minute >= 0 && minute <= 59 ? minute : 0;
    let second = parseInt(matches[6], 10);
    second = second >= 0 && second <= 59 ? second : 0;
    const universalTimeRelation = matches[7] || "Z";
    let offsetHour = parseInt(matches[8], 10);
    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
    let offsetMinute = parseInt(matches[9], 10) || 0;
    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

    // Universal time relation 'Z' means that the local time is equal to the
    // universal time, whereas the relations '+'/'-' indicate that the local
    // time is later respectively earlier than the universal time. Every date
    // is normalized to universal time.
    if (universalTimeRelation === "-") {
      hour += offsetHour;
      minute += offsetMinute;
    } else if (universalTimeRelation === "+") {
      hour -= offsetHour;
      minute -= offsetMinute;
    }

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  return datetimes.toDate = toDate;

});