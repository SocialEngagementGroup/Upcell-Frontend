import React from 'react';
import { useMyTradeInsQuery } from '../../queries/tradeIn';

// What a customer has traded in, and where each one is.
//
// The states are written out as sentences rather than shown as status codes. A
// customer does not want to know that their trade-in is "DeviceReceived"; they
// want to know whether UpCell has their phone and when they get paid.

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;

const amountOf = (request) =>
    request.payout?.amountCents
    ?? request.revisedOfferCents
    ?? request.estimateCents
    ?? Math.round((request.estimate || 0) * 100);

// One sentence per state. Anything not listed here falls back to the status
// itself, which is ugly but honest — better than a reassuring sentence about a
// state nobody has written copy for.
const WHERE_IT_IS = {
    Quoted: 'Quoted. Post it to us and we will check it over.',
    LabelIssued: 'Your prepaid label is ready — check your email.',
    InTransit: 'On its way to us.',
    Delivered: 'It has reached us. We will confirm once it is in our hands.',
    DeviceReceived: 'We have it. We will check it over within two working days.',
    InInspection: 'Being checked over now.',
    ActionRequired: 'We need something from you before we can finish — check your email.',
    RevisedOffer: 'We have made a revised offer. Check your email to accept or decline.',
    Approved: 'Agreed. Your payment is on its way.',
    Paid: 'Paid.',
    Rejected: 'We could not take this one. It is going back to you at our cost.',
    ReturnShipped: 'On its way back to you.',
    Expired: 'The quote ran out. Start a new one any time and we will requote it.',
    Cancelled: 'Cancelled.',
    Closed: 'Finished.',
};

const TradeInPanel = () => {
    const { data, isLoading, isError, error } = useMyTradeInsQuery();

    if (isLoading) return null;

    // 403 means the email is not confirmed. Worth saying, because the fix is
    // one click in an email the customer already has.
    if (isError && error?.response?.status === 403) {
        return (
            <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
                <h4 className="text-base font-medium text-apple-text">Your trade-ins</h4>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                    {error.response.data?.error}
                </p>
            </div>
        );
    }

    // Any other failure is silent. This is a panel on a page whose main job is
    // orders, and an error box here would read as something being wrong with
    // those.
    if (isError) return null;

    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
            <h4 className="text-base font-medium text-apple-text">Your trade-ins</h4>

            <ul className="mt-4 space-y-3">
                {items.map((request) => (
                    <li key={request._id} className="rounded-2xl bg-white p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-apple-text">
                                {request.modelTitle} {request.storage ? `· ${request.storage}` : ''}
                            </p>
                            <p className="text-sm font-medium text-apple-text">{money(amountOf(request))}</p>
                        </div>

                        <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                            {WHERE_IT_IS[request.status] || request.status}
                        </p>

                        {/* The label, while it is still the thing to act on. */}
                        {request.status === 'LabelIssued' && request.shipping?.inbound?.labelUrl ? (
                            <a
                                href={request.shipping.inbound.labelUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block text-sm font-medium text-brand-red"
                            >
                                Print your label
                            </a>
                        ) : null}

                        {request.status === 'RevisedOffer' && request.offerExpiresAt ? (
                            <p className="mt-1 text-xs text-apple-gray">
                                Please answer by {new Date(request.offerExpiresAt).toLocaleDateString()}.
                            </p>
                        ) : null}

                        {request.payout?.paidAt ? (
                            <p className="mt-1 text-xs text-apple-gray">
                                Paid {new Date(request.payout.paidAt).toLocaleDateString()}
                                {request.payout.method ? ` by ${request.payout.method.replace(/_/g, ' ').toLowerCase()}` : ''}.
                            </p>
                        ) : null}

                        {request.inspection?.finalGrade ? (
                            <p className="mt-1 text-xs text-apple-gray">
                                We graded it {request.inspection.finalGrade}
                                {request.inspection.batteryHealth != null
                                    ? `, battery ${request.inspection.batteryHealth}%`
                                    : ''}.
                            </p>
                        ) : null}

                        <p className="mt-2 font-mono text-[11px] text-apple-gray">{String(request._id).slice(-8)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TradeInPanel;
