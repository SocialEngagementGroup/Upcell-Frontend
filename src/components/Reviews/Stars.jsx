import React from 'react';

// Five stars, filled to a rating.
//
// Drawn with a clipped overlay rather than by rounding to whole or half
// stars. Rounding 4.3 up to 4.5 would show a product as better than its
// reviews, which is the direction that matters. The clip is a percentage of
// the row's width and the row has gaps, so a partial star is a pixel or two
// out — visibly right, and honest, which is what this needs to be.

const STAR = 'M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.4 6 20.6l1.3-6.8-5-4.7 6.8-.8z';

const Star = ({ filled }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-auto shrink-0">
        <path d={STAR} className={filled ? 'fill-brand-red' : 'fill-black/[0.12]'} />
    </svg>
);

const Stars = ({ rating = 0, count = null, size = 'h-4', className = '' }) => {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    const percent = (value / 5) * 100;

    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <span
                className={`relative inline-flex ${size}`}
                role="img"
                aria-label={`${value} out of 5 stars`}
            >
                <span className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => <Star key={i} filled={false} />)}
                </span>
                {/* The filled row sits on top, clipped to the rating. Hidden
                    from assistive tech because the label above already says
                    the number, and hearing the stars twice is worse. */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 flex gap-0.5 overflow-hidden"
                    style={{ width: `${percent}%` }}
                >
                    {[0, 1, 2, 3, 4].map((i) => <Star key={i} filled />)}
                </span>
            </span>

            {count !== null ? (
                <span className="text-sm text-ink-soft">
                    {value ? value.toFixed(1) : '—'}
                    {count ? ` (${count})` : ''}
                </span>
            ) : null}
        </span>
    );
};

export default Stars;
