import React, { useState } from 'react';
import Stars from './Stars';
import { useProductReviewsQuery } from '../../queries/reviews';

// What customers said, under the product they said it about.
//
// Every review here came from a delivered order belonging to the person who
// wrote it — that is what the badge means, and it is the only reason the
// section is worth the space. A shop selling used devices is asking people to
// trust a description, and reviews that anybody could have written do not help
// with that.

const BAR_LABELS = [5, 4, 3, 2, 1];

const ReviewsSection = ({ parentId, productName }) => {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useProductReviewsQuery(parentId, page);

    // Silent while loading and silent on failure. This sits below the buy
    // button on a page whose job is to sell a phone; an error box because one
    // secondary request failed reads as something being wrong with the
    // product.
    if (isLoading || isError || !data) return null;

    const { items = [], ratingAvg = 0, ratingCount = 0, counts = {}, pagination } = data;

    if (!ratingCount) {
        return (
            <section className="page-container border-t border-black/[0.06] py-12" aria-labelledby="reviews-heading">
                <h2 id="reviews-heading" className="text-[clamp(1.6rem,2.4vw,2.4rem)]">Reviews</h2>
                <p className="mt-3 max-w-[560px] text-base leading-8 text-ink-soft">
                    No reviews yet. Only people who bought this device here can write one, so the first
                    will come from somebody who has actually had it in their hand.
                </p>
            </section>
        );
    }

    return (
        <section className="page-container border-t border-black/[0.06] py-12" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="text-[clamp(1.6rem,2.4vw,2.4rem)]">
                What owners say
            </h2>

            <div className="mt-6 grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-12">
                <div>
                    <div className="text-[44px] font-bold leading-none text-apple-text">{ratingAvg.toFixed(1)}</div>
                    <Stars rating={ratingAvg} size="h-5" className="mt-2" />
                    <p className="mt-2 text-sm text-ink-soft">
                        {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}, all from verified buyers
                    </p>
                </div>

                {/* The spread, not only the average. 4.0 from straight fours
                    and 4.0 from half fives and half threes are different
                    products, and the second is the one worth knowing about. */}
                <div className="max-w-[420px] space-y-1.5">
                    {BAR_LABELS.map((star) => {
                        const count = counts[star] || 0;
                        const share = ratingCount ? (count / ratingCount) * 100 : 0;

                        return (
                            <div key={star} className="flex items-center gap-3 text-sm">
                                <span className="w-10 shrink-0 text-ink-soft">{star} star</span>
                                <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
                                    <span className="block h-full rounded-full bg-brand-red" style={{ width: `${share}%` }} />
                                </span>
                                <span className="w-8 shrink-0 text-right text-ink-soft">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ul className="mt-10 space-y-6">
                {items.map((review) => (
                    <li key={review._id} className="border-t border-black/[0.06] pt-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Stars rating={review.rating} size="h-4" />
                            <span className="text-sm font-medium text-apple-text">{review.displayName}</span>
                            {review.verifiedPurchase ? (
                                <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-medium text-brand-red">
                                    Verified purchase
                                </span>
                            ) : null}
                            <span className="text-xs text-apple-gray">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {review.title ? (
                            <h3 className="mt-3 text-base font-medium text-apple-text">{review.title}</h3>
                        ) : null}
                        {review.body ? (
                            <p className="mt-1.5 max-w-[720px] whitespace-pre-line text-base leading-8 text-ink-soft">
                                {review.body}
                            </p>
                        ) : null}
                    </li>
                ))}
            </ul>

            {pagination && pagination.totalPages > 1 ? (
                <div className="mt-8 flex items-center gap-3">
                    <button
                        type="button"
                        className="premium-button-secondary px-5 disabled:opacity-40"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                        Newer
                    </button>
                    <span className="text-sm text-ink-soft">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        type="button"
                        className="premium-button-secondary px-5 disabled:opacity-40"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((current) => current + 1)}
                    >
                        Older
                    </button>
                </div>
            ) : null}

            <p className="mt-8 text-sm leading-7 text-ink-soft">
                Bought {productName || 'this device'} from us? You can write a review from your account
                once it has been delivered.
            </p>
        </section>
    );
};

export default ReviewsSection;
