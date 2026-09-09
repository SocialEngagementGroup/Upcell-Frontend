import React from 'react';

// The bits every returns panel needs, in one place.
//
// Six panels hang off the request card — label, inspection, offer, settlement,
// ship-back, disposition — and each is a small form with the same shape: a
// heading, some fields, one button, and somewhere for the server's refusal to
// appear. Without this they end up as six slightly different forms, and the
// differences are all accidental.

export const money = (value) => `$${Number(value || 0).toFixed(2)}`;

export const Panel = ({ title, hint, children, onSubmit, submitLabel, busy, disabled, error, details }) => (
    <form
        className="mt-3 rounded-2xl border border-black/[0.06] bg-white p-4"
        onSubmit={(event) => {
            event.preventDefault();
            if (!busy && !disabled) onSubmit();
        }}
    >
        <h4 className="text-sm font-bold text-apple-text">{title}</h4>
        {hint ? <p className="mt-1 text-xs leading-5 text-ink-soft">{hint}</p> : null}

        <div className="mt-3 space-y-3">{children}</div>

        {/* The server's own words. It refuses for reasons the form cannot
            always predict — a tracking number already on another return, a
            deduction pointing at a check that passed — and paraphrasing them
            into "something went wrong" is how staff get stuck. */}
        {error ? (
            <p className="mt-3 rounded-xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red" role="alert">
                {error}
            </p>
        ) : null}
        {details?.length ? (
            <ul className="mt-2 space-y-1 text-xs text-brand-red">
                {details.map((detail) => <li key={detail}>• {detail}</li>)}
            </ul>
        ) : null}

        <button
            type="submit"
            disabled={busy || disabled}
            className="premium-button mt-4 h-11 w-full justify-center px-4 text-sm"
        >
            {busy ? 'Saving…' : submitLabel}
        </button>
    </form>
);

export const Field = ({ label, hint, children }) => (
    <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">{label}</span>
        {children}
        {hint ? <span className="mt-1 block text-[11px] leading-4 text-ink-soft">{hint}</span> : null}
    </label>
);

const inputClass =
    'mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25';

export const Text = (props) => <input type="text" className={inputClass} {...props} />;
export const Num = (props) => <input type="number" step="0.01" className={inputClass} {...props} />;
export const Area = (props) => <textarea rows={3} className={inputClass} {...props} />;
export const Select = ({ children, ...props }) => (
    <select className={inputClass} {...props}>{children}</select>
);

// What a staff member should notice before approving. Not a blocker — staff
// approve returns outside the window all the time, and should.
const FLAG_STYLES = {
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    info: 'bg-black/[0.04] text-ink-soft ring-black/[0.06]',
};

export const ReturnFlags = ({ flags = [] }) => {
    if (!flags.length) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {flags.map((flag) => (
                <span
                    key={flag.code}
                    title={flag.message}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                        FLAG_STYLES[flag.severity] || FLAG_STYLES.info
                    }`}
                >
                    {flag.message}
                </span>
            ))}
        </div>
    );
};

// The numbers the queue puts on every row, so approving is one click rather
// than one click and four lookups.
export const QueueSummary = ({ queue }) => {
    if (!queue) return null;

    const parts = [
        queue.orderValue != null && `Order ${money(queue.orderValue)}`,
        queue.daysSinceDelivery != null && `${queue.daysSinceDelivery}d since delivery`,
        queue.reasonCode,
        queue.faultAttribution && `${queue.faultAttribution === 'UPCELL' ? 'Our fault' : 'Customer'}`,
        queue.priorReturns > 0 && `${queue.priorReturns} previous return${queue.priorReturns === 1 ? '' : 's'}`,
    ].filter(Boolean);

    return (
        <p className="mt-1 text-xs text-ink-soft">{parts.join(' · ')}</p>
    );
};
