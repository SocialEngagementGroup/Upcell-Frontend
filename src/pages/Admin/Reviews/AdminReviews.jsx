import React, { useState } from 'react';
import { toast } from 'sonner';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import Stars from '../../../components/Reviews/Stars';
import { useAdminReviewsQuery, useModerateReviewMutation } from '../../../queries/reviews';
import { extractApiError } from '../../../utilities/formValidation';

// Reading what customers wrote before anybody else does.
//
// Nothing reaches a product page until somebody here approves it. The cost of
// that is a customer waiting a day; the cost of publishing automatically is
// whatever somebody chose to type appearing under a product UpCell sells.

const TABS = [
    { status: 'PENDING', label: 'Waiting' },
    { status: 'APPROVED', label: 'Published' },
    { status: 'HIDDEN', label: 'Hidden' },
];

const ReviewCard = ({ review, onModerate, busy }) => {
    const [note, setNote] = useState('');
    const [hiding, setHiding] = useState(false);

    const hide = () => {
        // Hiding a review is the decision worth explaining, so the box opens
        // before the action runs rather than sending an empty note to be
        // refused.
        if (!hiding) {
            setHiding(true);
            return;
        }
        if (note.trim().length < 5) return;
        onModerate({ id: review._id, status: 'HIDDEN', moderationNote: note.trim() });
        setNote('');
        setHiding(false);
    };

    return (
        <div className="premium-card rounded-[24px] p-5">
            <div className="flex flex-wrap items-center gap-3">
                <Stars rating={review.rating} size="h-4" />
                <span className="text-sm font-medium text-apple-text">{review.displayName}</span>
                <span className="text-xs text-apple-gray">
                    {new Date(review.createdAt).toLocaleString()}
                </span>
                {review.verifiedPurchase ? (
                    <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-medium text-brand-red">
                        Verified purchase
                    </span>
                ) : null}
            </div>

            {review.title ? (
                <h3 className="mt-3 text-base font-medium text-apple-text">{review.title}</h3>
            ) : null}
            {review.body ? (
                <p className="mt-1.5 whitespace-pre-line text-sm leading-7 text-ink-soft">{review.body}</p>
            ) : null}

            <p className="mt-3 font-mono text-xs text-apple-gray">
                Order {String(review.orderId)} · Product {String(review.productId)}
            </p>

            {review.moderationNote ? (
                <p className="mt-2 rounded-2xl bg-surface-alt p-3 text-xs leading-5 text-ink-soft">
                    Hidden by {review.moderatedBy || 'staff'}: {review.moderationNote}
                </p>
            ) : null}

            {hiding ? (
                <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Why is this being hidden? An unexplained removal cannot be defended later."
                    className="admin-input mt-3 min-h-[80px]"
                />
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
                {review.status !== 'APPROVED' ? (
                    <button
                        type="button"
                        className="premium-button px-5"
                        disabled={busy}
                        onClick={() => onModerate({ id: review._id, status: 'APPROVED' })}
                    >
                        Publish
                    </button>
                ) : null}

                {review.status !== 'HIDDEN' ? (
                    <button
                        type="button"
                        className="premium-button-secondary px-5"
                        disabled={busy || (hiding && note.trim().length < 5)}
                        onClick={hide}
                    >
                        {hiding ? 'Confirm hide' : 'Hide'}
                    </button>
                ) : null}

                {hiding ? (
                    <button
                        type="button"
                        className="premium-button-secondary px-5"
                        onClick={() => { setHiding(false); setNote(''); }}
                    >
                        Cancel
                    </button>
                ) : null}
            </div>
        </div>
    );
};

const AdminReviews = () => {
    const [status, setStatus] = useState('PENDING');
    const { data, isLoading } = useAdminReviewsQuery(status);
    const moderate = useModerateReviewMutation();

    const items = data?.items || [];

    const onModerate = (payload) => moderate.mutate(payload, {
        onSuccess: () => toast.success(payload.status === 'APPROVED' ? 'Review published.' : 'Review hidden.'),
        onError: (error) => toast.error(extractApiError(error)),
    });

    const stats = [
        { label: 'In this view', value: data?.pagination?.totalItems ?? 0, sub: TABS.find((t) => t.status === status)?.label.toLowerCase() },
        { label: 'Showing', value: items.length, sub: 'on this page' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Reviews"
                title="What customers said."
                description="Every review here came from a delivered order belonging to the person who wrote it. Nothing appears on a product page until it is published."
            />

            <AdminStatsGrid items={stats} />

            <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.status}
                        type="button"
                        onClick={() => setStatus(tab.status)}
                        className={status === tab.status ? 'premium-button px-5' : 'premium-button-secondary px-5'}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading reviews" description="Pulling what customers have written." />
            ) : items.length ? (
                <div className="space-y-5">
                    {items.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onModerate={onModerate}
                            busy={moderate.isPending}
                        />
                    ))}
                </div>
            ) : (
                <AdminEmptyState
                    title={status === 'PENDING' ? 'Nothing waiting.' : 'Nothing here.'}
                    description={
                        status === 'PENDING'
                            ? 'Every review has been read. New ones arrive a week after a device is delivered.'
                            : 'No reviews in this state yet.'
                    }
                />
            )}
        </section>
    );
};

export default AdminReviews;
