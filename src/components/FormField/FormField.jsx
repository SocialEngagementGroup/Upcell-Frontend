import React from 'react';

// One field plus its own error message.
//
// Forms here used to show a single message at the bottom of the whole form,
// which told the customer something was wrong but not what or where. Putting
// the message under the field it belongs to is the difference between a form
// someone can fix and one they abandon.

const FormField = ({
    id,
    label,
    error,
    touched,
    hint,
    children,
    className = '',
}) => {
    // Only show an error once the customer has actually left the field. Marking
    // an empty form red before anyone has typed is noise, not help.
    const showError = Boolean(error && touched);

    return (
        <div className={`grid gap-2 ${className}`}>
            {label ? (
                <label
                    htmlFor={id}
                    className="text-[11px] font-bold uppercase tracking-[0.16em] text-apple-gray"
                >
                    {label}
                </label>
            ) : null}

            {children({
                id,
                'aria-invalid': showError || undefined,
                // Points a screen reader at the message below, so it is
                // announced with the field rather than left unread.
                'aria-describedby': showError ? `${id}-error` : hint ? `${id}-hint` : undefined,
                className: showError
                    ? 'premium-input !border-brand-red !bg-brand-red/[0.03] focus:!bg-white'
                    : 'premium-input bg-apple-gray/5 border-transparent focus:bg-white',
            })}

            {showError ? (
                <p
                    id={`${id}-error`}
                    // role="alert" so the message is announced as soon as it
                    // appears, not only when the field is next focused.
                    role="alert"
                    className="flex items-start gap-1.5 text-[13px] font-semibold leading-5 text-brand-red"
                >
                    <span aria-hidden="true">!</span>
                    {error}
                </p>
            ) : hint ? (
                <p id={`${id}-hint`} className="text-[13px] leading-5 text-apple-gray">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

export default FormField;
