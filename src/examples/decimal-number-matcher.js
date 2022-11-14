// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 */
class DecimalNumberMatcher {
  constructor(maxDigits, maxDecimalPlaces) {
    this.maxDigits = maxDigits;
    this.maxDecimalPlaces = maxDecimalPlaces;
  }

  match(value) {
    const validationResult = new ValidationResult();

    if (value != null) {
      const DEFAULT_MAX_DIGITS = 11;

      const decimalNumber = _convertToDecimal(value, validationResult);

      if (decimalNumber) {
        const maxDigits = Number(this.maxDigits) || DEFAULT_MAX_DIGITS;
        const maxDecimalPlaces = Number(this.maxDecimalPlaces);

        _validateDigitsCount(decimalNumber, maxDigits, validationResult);

        if (maxDecimalPlaces >= 0) {
          _validateDecimalPlacesCount(decimalNumber, maxDecimalPlaces, validationResult);
        }
      }
    }

    return validationResult;
  }
}

function _convertToDecimal(value, validationResult) {
  try {
    return new Decimal(value);
  } catch (e) {
    _addInvalidDecimalErr(validationResult);
  }
}

function _validateDigitsCount(decimalNumber, maxDigits, validationResult) {
  const limitExceeded = decimalNumber.precision(true) > maxDigits;
  if (limitExceeded) {
    _addMaxDigitsErr(validationResult);
  }
}

function _validateDecimalPlacesCount(decimalNumber, maxDecimalPlaces, validationResult) {
  const limitExceeded = decimalNumber.decimalPlaces() > maxDecimalPlaces;
  if (limitExceeded) {
    _addMaxDecimalPlacesErr(validationResult);
  }
}

function _addInvalidDecimalErr(validationResult) {
  validationResult.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
}

function _addMaxDigitsErr(validationResult) {
  validationResult.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
}

function _addMaxDecimalPlacesErr(validationResult) {
  validationResult.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
}

module.exports = DecimalNumberMatcher;
