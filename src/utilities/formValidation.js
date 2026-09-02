import isEmail from 'validator/es/lib/isEmail';
import isLength from 'validator/es/lib/isLength';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import isPostalCode from 'validator/es/lib/isPostalCode';

// Imported one rule at a time rather than the whole `validator` package: the
// full bundle is ~150kB and this needs four checks out of it.
//
// From es/lib, not lib. The CJS build at validator/lib exports isPostalCode and
// isMobilePhone as { default, locales } — an object, not a function — so those
// two would throw "is not a function" the first time a customer entered a ZIP.
// A bundler does not catch it: the build succeeds either way.
//
// These replaced hand-written regexes. The email one in particular accepted
// "a@b.c" and anything else vaguely shaped like an address, which meant an
// invalid address passed the form and failed later — at the server, or worse,
// silently, when a reply bounced.

export const validateRequiredText = (label, value, { min = 1, max = 2000 } = {}) => {
    const normalized = String(value || '').trim();

    if (!normalized) return `${label} is required.`;
    if (!isLength(normalized, { min })) {
        return `${label} must be at least ${min} characters.`;
    }
    if (!isLength(normalized, { max })) {
        return `${label} must be ${max} characters or fewer.`;
    }
    return '';
};

export const validateEmailAddress = (value) => {
    const normalized = String(value || '').trim();

    if (!normalized) return 'Email is required.';
    // Deliberately stricter than the server's check. Anything this accepts, the
    // server accepts too — so a customer never passes the form and is then
    // rejected by the API with a vaguer message.
    if (!isEmail(normalized)) return 'Please enter a valid email address.';
    return '';
};

export const validatePhoneNumber = (value) => {
    const normalized = String(value || '').trim();
    const digits = normalized.replace(/\D/g, '');

    if (!normalized) return 'Phone number is required.';
    // Digit count first, then the US format check. The server strips everything
    // but digits before sending the number to the bank, which rejects a phone
    // containing brackets or dashes, so "(313) 288-8312" must pass here.
    if (digits.length < 7 || digits.length > 15) {
        return 'Please enter a valid phone number.';
    }
    if (!isMobilePhone(digits, 'en-US') && digits.length === 10) {
        return 'Please enter a valid US phone number.';
    }
    return '';
};

// US only, matching the server's orderSchema. A wrong ZIP is not just a form
// error — the bank checks it against the card issuer's records and declines
// the payment, which the customer sees as an unexplained "payment failed".
export const validateUsZip = (value) => {
    const normalized = String(value || '').trim();

    if (!normalized) return 'ZIP code is required.';
    if (!isPostalCode(normalized, 'US')) {
        return 'Enter a 5-digit ZIP code, e.g. 94043.';
    }
    return '';
};

// The same list the server checks against. "FD" is two letters and used to pass
// a length-only check, but it is not a state — the card issuer's address check
// fails and the sale is lost, with nothing on screen explaining why.
const US_STATE_CODES = new Set(
    ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO ' +
     'MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY ' +
     'DC AS GU MP PR VI AA AE AP').split(' ')
);

export const validateUsState = (value) => {
    const normalized = String(value || '').trim().toUpperCase();

    if (!normalized) return 'State is required.';
    if (!US_STATE_CODES.has(normalized)) {
        return 'Enter a valid 2-letter state code, e.g. OH.';
    }
    return '';
};

/**
 * Run every field's rule and return all the failures at once.
 *
 * The forms used to chain with `||`, which surfaced one error per submit: a
 * customer with three bad fields had to submit three times to discover them.
 *
 * @param {Object} values  field name -> value
 * @param {Object} rules   field name -> (value) => error string or ''
 * @returns {Object} field name -> error, containing only the fields that failed
 */
export const validateFields = (values, rules) =>
    Object.entries(rules).reduce((errors, [field, rule]) => {
        const message = rule(values[field]);
        if (message) errors[field] = message;
        return errors;
    }, {});

export const extractApiError = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (Array.isArray(responseData?.details) && responseData.details.length) {
        // Entries without a `message` would render as the literal word
        // "undefined", so anything lacking one is dropped rather than shown.
        const messages = responseData.details
            .map((item) => item?.message)
            .filter(Boolean);
        if (messages.length) return messages.join(' ');
    }

    return responseData?.message || responseData?.error || fallbackMessage;
};
