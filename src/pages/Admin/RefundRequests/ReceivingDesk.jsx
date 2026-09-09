import React, { useState } from 'react';
import { useReturnLookup, useShipBackQueueQuery } from '../../../queries/refundRequests';
import { money } from './ReturnPanelKit';

// The bench. A parcel arrives, somebody types the number off it, and the
// return it belongs to comes up.
//
// Looking it up is the whole point: a new record for something that has
// arrived leaves the customer's request open forever beside a duplicate with
// no history. The 404 says so in as many words.
const ReceivingDesk = () => {
    const [term, setTerm] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const lookup = useReturnLookup();
    const { data: shipBacks } = useShipBackQueueQuery();

    const search = (event) => {
        event.preventDefault();
        if (term.trim().length < 4) return;

        setError('');
        setResult(null);

        lookup.mutate(term.trim(), {
            onSuccess: (data) => setResult(data.request),
            onError: (lookupError) => setError(
                lookupError?.response?.data?.hint
                || lookupError?.response?.data?.error
                || 'Nothing found.'
            ),
        });
    };

    const awaiting = shipBacks?.awaitingShipBack || [];
    const undeliverable = shipBacks?.undeliverable || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-[28px]">Receiving desk</h2>
                <p className="mt-1 text-sm text-ink-soft">
                    Type the RMA off the box, or the tracking number off the label.
                </p>
            </div>

            <form onSubmit={search} className="flex gap-2">
                <input
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="RMA-2026-00412 or 794123456789"
                    className="flex-1 rounded-2xl border border-black/[0.08] bg-white p-3 font-mono text-sm outline-none focus:border-apple-text/25"
                />
                <button type="submit" disabled={lookup.isPending} className="premium-button px-6 text-sm">
                    {lookup.isPending ? 'Looking…' : 'Find'}
                </button>
            </form>

            {error ? (
                <p className="rounded-2xl bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red" role="alert">
                    {error}
                </p>
            ) : null}

            {result ? (
                <div className="premium-card rounded-[24px] p-5">
                    <p className="font-mono text-sm font-medium text-apple-text">{result.rmaNumber}</p>
                    <p className="mt-1 text-sm text-ink-soft">{result.email}</p>
                    <p className="mt-2 text-xs text-apple-gray">
                        Status: {result.status}
                        {result.reasonCode ? ` · ${result.reasonCode}` : ''}
                        {result.calculatedAmount ? ` · ${money(result.calculatedAmount)}` : ''}
                    </p>
                    <p className="mt-3 rounded-2xl bg-surface-alt p-3 text-sm leading-6 text-ink-soft">
                        {result.reason}
                    </p>
                    {/* Deliberately no action here. Marking it received happens
                        on the returns queue, where the rest of the request is
                        in front of the person doing it. */}
                    <p className="mt-3 text-xs text-ink-soft">
                        Open this in Returns to mark it as arrived.
                    </p>
                </div>
            ) : null}

            {awaiting.length > 0 ? (
                <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                        Waiting to go back — oldest first
                    </h4>
                    <ul className="mt-3 space-y-2">
                        {awaiting.map((request) => (
                            <li key={request._id} className="flex justify-between text-xs">
                                <span className="font-mono text-apple-text">{request.rmaNumber || request._id}</span>
                                <span className="text-ink-soft">
                                    {request.priorRejections > 0
                                        ? `${request.priorRejections} previous rejection${request.priorRejections === 1 ? '' : 's'}`
                                        : request.email}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {undeliverable.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-amber-700">
                        Came back undelivered
                    </h4>
                    <ul className="mt-3 space-y-2">
                        {undeliverable.map((entry) => (
                            <li key={entry._id} className="flex justify-between text-xs">
                                <span className="font-mono text-apple-text">{entry.rmaNumber || entry._id}</span>
                                <span className={entry.daysLeft != null && entry.daysLeft < 14 ? 'text-brand-red' : 'text-amber-700'}>
                                    {entry.daysLeft != null ? `${entry.daysLeft} days before disposal` : 'On hold'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default ReceivingDesk;
