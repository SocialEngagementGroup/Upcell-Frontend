import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Seo from '../../components/Seo/Seo';
import { extractApiError } from '../../utilities/formValidation';
import { useTradeInOfferQuery, useAnswerTradeInOfferMutation } from '../../queries/tradeIn';

// Answering a revised trade-in offer, from the link in an email.
//
// No login on purpose. An offer somebody cannot open is an offer that expires
// and a device that gets posted back — and a customer reading this on a phone
// has probably not signed in for months. The token in the URL is the only proof
// there is, which is why it is 256 random bits and why the page never confirms
// that an id exists without it.
//
// The page does not answer on load. A link opened by a mail client's preview
// fetcher must not accept an offer on somebody's behalf, so both answers are a
// button somebody presses.

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;

const Shell = ({ children }) => (
    <main className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[640px]">{children}</div>
    </main>
);

const TradeInOffer = () => {
    const { id, token } = useParams();
    const [answered, setAnswered] = useState(null);

    const { data, isLoading, isError, error } = useTradeInOfferQuery(id, token);
    const answer = useAnswerTradeInOfferMutation();

    const respond = (decision) => {
        answer.mutate(
            { id, decision, token },
            {
                onSuccess: (result) => {
                    setAnswered(result);
                    toast.success(decision === 'accept' ? 'Accepted' : 'Declined');
                },
                onError: (failure) => toast.error(extractApiError(failure)),
            }
        );
    };

    if (isLoading) {
        return (
            <Shell>
                <Seo title="Your trade-in offer" noIndex />
                <p className="text-base text-ink-soft">Loading your offer…</p>
            </Shell>
        );
    }

    // A wrong or expired link, or an id that does not exist. All three answer
    // the same way: nothing is confirmed about whether the record is real.
    if (isError) {
        return (
            <Shell>
                <Seo title="Offer not found" noIndex />
                <h1 className="text-[clamp(1.8rem,3vw,2.6rem)]">We could not open that link</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">
                    {extractApiError(error) || 'That link is no longer valid.'} If you were expecting an offer, reply to
                    the email we sent and we will look at it again.
                </p>
            </Shell>
        );
    }

    if (answered) {
        return (
            <Shell>
                <Seo title="Thanks" noIndex />
                <h1 className="text-[clamp(1.8rem,3vw,2.6rem)]">Thanks — that is settled</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">{answered.message}</p>
            </Shell>
        );
    }

    // Already answered, or the five days ran out. The server sends the sentence
    // to show, so the customer is never left guessing which it was.
    if (!data?.ok) {
        return (
            <Shell>
                <Seo title="Your trade-in offer" noIndex />
                <h1 className="text-[clamp(1.8rem,3vw,2.6rem)]">Nothing further is needed</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">{data?.message}</p>
            </Shell>
        );
    }

    const quoted = data.quotedCents;
    const offered = data.offeredCents;

    return (
        <Shell>
            <Seo title="Your trade-in offer" noIndex />

            <span className="eyebrow mb-5">Trade-in</span>
            <h1 className="text-[clamp(1.8rem,3vw,2.6rem)]">A revised offer for your {data.modelTitle}</h1>

            <p className="mt-4 text-base leading-8 text-ink-soft">
                We checked the device over and it was not quite as described, so we cannot pay the original quote.
                Here is what we found and what we can offer. If you would rather not accept, say so and we will post
                it straight back to you at our cost — there is nothing to pay either way.
            </p>

            <div className="mt-8 rounded-[28px] bg-surface-alt p-6">
                <dl className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <dt className="text-sm text-ink-soft">Original quote</dt>
                        <dd className="text-base text-ink-soft line-through">{money(quoted)}</dd>
                    </div>

                    {data.deductions?.map((line, index) => (
                        <div key={index} className="border-t border-black/[0.06] pt-3">
                            <div className="flex items-baseline justify-between">
                                <dt className="text-sm text-apple-text">{line.type.replace(/_/g, ' ').toLowerCase()}</dt>
                                <dd className="text-sm font-medium text-apple-text">−${Number(line.amount).toFixed(2)}</dd>
                            </div>
                            {/* The reason, in the words a person wrote. A number
                                with no explanation is what gets disputed. */}
                            <p className="mt-1 text-sm leading-6 text-ink-soft">{line.reason}</p>
                        </div>
                    ))}

                    <div className="flex items-baseline justify-between border-t border-black/[0.06] pt-3">
                        <dt className="text-base font-medium text-apple-text">We can offer</dt>
                        <dd className="text-2xl font-bold text-brand-red">{money(offered)}</dd>
                    </div>
                </dl>

                {data.finalGrade || data.batteryHealth != null ? (
                    <p className="mt-4 text-xs leading-5 text-ink-soft">
                        We graded it {data.finalGrade || '—'}
                        {data.batteryHealth != null ? `, with the battery at ${data.batteryHealth}%` : ''}.
                    </p>
                ) : null}
            </div>

            <p className="mt-6 text-sm text-ink-soft">
                Please answer by {new Date(data.expiresAt).toLocaleDateString()}. After that we post the device back
                automatically, so nothing gets stuck.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    type="button"
                    className="premium-button px-7"
                    disabled={answer.isPending}
                    onClick={() => respond('accept')}
                >
                    {answer.isPending ? 'Sending…' : `Accept ${money(offered)}`}
                </button>
                <button
                    type="button"
                    className="premium-button-secondary px-7"
                    disabled={answer.isPending}
                    onClick={() => respond('decline')}
                >
                    Send it back instead
                </button>
            </div>
        </Shell>
    );
};

export default TradeInOffer;
