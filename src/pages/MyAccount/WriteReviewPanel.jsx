import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMyReviewsQuery, useWriteReviewMutation } from '../../queries/reviews';
import { extractApiError } from '../../utilities/formValidation';
import Stars from '../../components/Reviews/Stars';

// Asking a customer what they thought, on the order they bought it on.
//
// Only appears once the order is delivered, and only for devices they have
// not already reviewed — the server enforces both, and offering a form that
// is going to be refused is worse than not offering one.

const MAX_TITLE = 80;
const MAX_BODY = 2000;

const RatingPicker = ({ value, onChange }) => (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                role="radio"
                aria-checked={value === star}
                aria-label={`${star} star${star === 1 ? '' : 's'}`}
                onClick={() => onChange(star)}
                className="rounded-full p-1 transition-transform hover:scale-110"
            >
                <Stars rating={value >= star ? 1 : 0} size="h-6" className="[&>span]:w-auto" />
            </button>
        ))}
    </div>
);

const ReviewForm = ({ order, item, onDone }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [touched, setTouched] = useState(false);

    const write = useWriteReviewMutation();

    const submit = (event) => {
        event.preventDefault();
        setTouched(true);
        if (!rating) return;

        write.mutate(
            { orderId: order._id, productId: item.productId, rating, title: title.trim() || undefined, body: body.trim() || undefined },
            {
                onSuccess: (result) => {
                    toast.success(result?.message || 'Thanks — your review will appear once we have read it.');
                    onDone();
                },
                onError: (error) => toast.error(extractApiError(error)),
            }
        );
    };

    return (
        <form onSubmit={submit} className="mt-3 rounded-2xl bg-white p-4">
            <p className="text-sm font-medium text-apple-text">{item.name}</p>

            <div className="mt-3">
                <RatingPicker value={rating} onChange={setRating} />
                {touched && !rating ? (
                    <p className="mt-1 text-xs font-medium text-brand-red">Choose a rating.</p>
                ) : null}
            </div>

            <input
                type="text"
                value={title}
                maxLength={MAX_TITLE}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Sum it up in a few words (optional)"
                className="mt-3 w-full rounded-2xl border border-black/[0.08] p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
            />

            <textarea
                value={body}
                maxLength={MAX_BODY}
                onChange={(event) => setBody(event.target.value)}
                placeholder="How has it been to live with? Battery, condition, anything the next buyer should know."
                className="mt-2 min-h-[110px] w-full rounded-2xl border border-black/[0.08] p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
            />
            <p className="mt-1 text-right text-xs text-apple-gray">{body.length}/{MAX_BODY}</p>

            <div className="mt-3 flex gap-2">
                <button type="submit" className="premium-button px-5" disabled={write.isPending}>
                    {write.isPending ? 'Sending…' : 'Post review'}
                </button>
                <button type="button" className="premium-button-secondary px-5" onClick={onDone}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

const WriteReviewPanel = ({ order, lines }) => {
    const [writing, setWriting] = useState(null);
    const { data } = useMyReviewsQuery();

    // Only once it has arrived. Reviewing a phone in transit is reviewing the
    // photograph.
    if (order?.status !== 'Delivered') return null;

    const already = new Set(data?.reviewed || []);
    const pending = (lines || []).filter(
        (line) => line.productId && !already.has(`${order._id}:${line.productId}`)
    );

    if (!pending.length) {
        // Nothing left to say. Silent rather than "you have reviewed
        // everything", which is a sentence nobody needs.
        return null;
    }

    return (
        <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
            <h4 className="text-base font-medium text-apple-text">How did you get on?</h4>
            <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                A couple of lines from you is worth more to the next buyer than anything we could
                write. Because you bought it here, your review carries a verified badge.
            </p>

            <div className="mt-3 space-y-2">
                {pending.map((line) => (
                    <div key={line.productId}>
                        {writing === line.productId ? (
                            <ReviewForm order={order} item={line} onDone={() => setWriting(null)} />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setWriting(line.productId)}
                                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-3 text-left transition-colors hover:bg-white/70"
                            >
                                <span className="text-sm text-apple-text">{line.name}</span>
                                <span className="text-sm font-medium text-brand-red">Write a review</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WriteReviewPanel;
