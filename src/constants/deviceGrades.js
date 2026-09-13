// How a device's condition is described to a customer.
//
// Two scales exist in the data. `cosmeticGrade` is the returns scale —
// EXCELLENT, GOOD, FAIR, FAIL — set by an inspection or by the September
// migration, and it is the one the whole returns system reasons about.
// `condition` is the older free-text field the catalogue was built with:
// Mint, Excellent, Good, New, and a misspelt "Refubrished".
//
// The grade wins where there is one, because it is the value that decides what
// a return is worth and what a device is re-listed at. The old field is the
// fallback for anything the migration could not map, so nothing loses its
// description.

const GRADE_LABELS = {
    EXCELLENT: 'Excellent',
    GOOD: 'Good',
    FAIR: 'Fair',
    FAIL: 'Not working',
};

const GRADE_EXPLANATIONS = {
    EXCELLENT: 'Minimal to no visible wear. Looks close to new under normal use.',
    GOOD: 'Light, normal signs of use with minor cosmetic marks. Fully functional.',
    FAIR: 'Noticeable cosmetic wear such as light scratches or scuffs. Fully tested and functional.',
    FAIL: 'Not working. Sold for parts or repair only.',
};

// The old free-text values, kept for rows the migration could not map. The
// misspelling is deliberate: it is in the data, and dropping the key here
// would leave those products with no description at all.
const LEGACY_EXPLANATIONS = {
    New: 'Brand new and unused, in factory-sealed packaging.',
    Mint: 'Barely used. No visible marks under normal light.',
    Excellent: 'Minimal to no visible wear. Looks close to new under normal use.',
    Good: 'Light, normal signs of use with minor cosmetic marks. Fully functional.',
    Fair: 'Noticeable cosmetic wear such as light scratches or scuffs. Fully tested and functional.',
    Refurbished: 'Professionally restored and tested to full working condition.',
    Refubrished: 'Professionally restored and tested to full working condition.',
};

/**
 * What to show, and what to say about it.
 *
 * @returns {{label: string, explanation?: string} | null}
 */
export const gradeFor = (product) => {
    const grade = product?.cosmeticGrade;
    if (grade && GRADE_LABELS[grade]) {
        return { label: GRADE_LABELS[grade], explanation: GRADE_EXPLANATIONS[grade] };
    }

    const legacy = product?.condition;
    if (legacy) {
        return { label: legacy, explanation: LEGACY_EXPLANATIONS[legacy] };
    }

    return null;
};

// How a carrier lock is described. UNLOCKED is not shown as a caveat — it is
// the thing a buyer wants, so it reads as a feature rather than a restriction.
const CARRIER_LABELS = {
    UNLOCKED: 'Unlocked — works with any carrier',
    ATT: 'Locked to AT&T',
    VERIZON: 'Locked to Verizon',
    TMOBILE: 'Locked to T-Mobile',
    OTHER: 'Locked to a carrier',
};

export const carrierLabelFor = (product) => CARRIER_LABELS[product?.carrierStatus] || null;

/**
 * Battery health, when it is worth showing.
 *
 * Below 80% is not listed at all — refurbState keeps those off the shop — so
 * anything reaching a customer is 80 or above and the number is reassurance
 * rather than a warning.
 */
export const batteryLabelFor = (product) => {
    const value = Number(product?.batteryHealth);
    if (!Number.isFinite(value) || value <= 0) return null;
    return `${Math.round(value)}%`;
};
