const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRequiredText = (label, value, { min = 1, max = 2000 } = {}) => {
    const normalized = String(value || '').trim();

    if (!normalized) return `${label} is required.`;
    if (normalized.length < min) return `${label} must be at least ${min} characters.`;
    if (normalized.length > max) return `${label} must be ${max} characters or fewer.`;
    return '';
};

export const validateEmailAddress = (value) => {
    const normalized = String(value || '').trim();
    if (!normalized) return 'Email is required.';
    if (!emailPattern.test(normalized)) return 'Please enter a valid email address.';
    return '';
};

export const validatePhoneNumber = (value) => {
    const normalized = String(value || '').trim();
    const digits = normalized.replace(/\D/g, '');

    if (!normalized) return 'Phone number is required.';
    if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number.';
    return '';
};

export const extractApiError = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (Array.isArray(responseData?.details) && responseData.details.length) {
        return responseData.details.map((item) => item.message).join(' ');
    }

    return responseData?.message || responseData?.error || fallbackMessage;
};
