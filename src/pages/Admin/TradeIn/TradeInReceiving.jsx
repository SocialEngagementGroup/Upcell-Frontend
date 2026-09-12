import React, { useState } from 'react';
import { toast } from 'sonner';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import { extractApiError } from '../../../utilities/formValidation';
import { money } from '../RefundRequests/ReturnPanelKit';
import { lookupTradeIn, useTradeInStatusMutation } from '../../../queries/tradeIn';
import { TOAST_ICONS } from '../../../utilities/toastIcons';

// The receiving desk.
//
// Somebody is standing at a bench with a box in their hands and a number on it.
// One box to type into, because the alternative is twelve tabs and a guess.
//
// The one thing this page has to make hard is opening a new request for a parcel
// that has already arrived: that loses the quote the customer was given, and
// they find out when they are paid the wrong amount.

const TradeInReceiving = () => {
    const [term, setTerm] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [hint, setHint] = useState('');
    const [busy, setBusy] = useState(false);

    const move = useTradeInStatusMutation();

    const search = async (event) => {
        event.preventDefault();
        if (term.trim().length < 4) return;

        setBusy(true);
        setError('');
        setHint('');
        setResult(null);

        try {
            const found = await lookupTradeIn(term.trim());
            setResult(found.request);
        } catch (failure) {
            setError(extractApiError(failure));
            setHint(failure?.response?.data?.hint || '');
        } finally {
            setBusy(false);
        }
    };

    const confirmArrival = () => {
        move.mutate(
            { id: result._id, status: 'DeviceReceived' },
            {
                onSuccess: (updated) => {
                    setResult(updated);
                    toast.success('Marked as received. It is on the bench now.', { icon: TOAST_ICONS.statusChanged });
                },
                onError: (failure) => setError(extractApiError(failure)),
            }
        );
    };

    const inTransit = () => {
        move.mutate(
            { id: result._id, status: 'InTransit' },
            {
                onSuccess: (updated) => setResult(updated),
                onError: (failure) => setError(extractApiError(failure)),
            }
        );
    };

    // A device is received from InTransit or Delivered and nowhere else, so a
    // parcel that arrived before anybody marked it moving needs both clicks.
    // Said here rather than letting the server refuse the second one.
    const needsTransitFirst = result?.status === 'LabelIssued';
    const canReceive = ['InTransit', 'Delivered'].includes(result?.status);

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="Receiving desk."
                description="A box, a number, one field. Type the tracking number off the label or the IMEI off the device."
            />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <form className="flex flex-wrap gap-3" onSubmit={search}>
                    <input
                        className="admin-input flex-1"
                        type="text"
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Tracking number or IMEI"
                        autoFocus
                    />
                    <button className="premium-button px-6" type="submit" disabled={busy || term.trim().length < 4}>
                        {busy ? 'Looking…' : 'Find it'}
                    </button>
                </form>

                {error ? (
                    <div className="mt-4 rounded-2xl bg-brand-red/10 p-4">
                        <p className="text-sm font-semibold text-brand-red">{error}</p>
                        {hint ? <p className="mt-1.5 text-xs leading-5 text-ink-soft">{hint}</p> : null}
                    </div>
                ) : null}
            </div>

            {result ? (
                <div className="admin-panel rounded-[36px] p-6 md:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">{result.status}</p>
                    <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2.2rem)]">{result.modelTitle}</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                        {result.name} · {result.email}
                    </p>

                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Quoted</dt>
                            <dd className="mt-1 text-lg font-medium text-apple-text">
                                {money((result.estimateCents ?? Math.round((result.estimate || 0) * 100)) / 100)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Storage</dt>
                            <dd className="mt-1 text-lg font-medium text-apple-text">{result.storage}</dd>
                        </div>
                        {result.shipping?.inbound?.trackingNumber ? (
                            <div>
                                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Tracking</dt>
                                <dd className="mt-1 font-mono text-sm text-apple-text">
                                    {result.shipping.inbound.carrier} {result.shipping.inbound.trackingNumber}
                                </dd>
                            </div>
                        ) : null}
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {needsTransitFirst ? (
                            <>
                                <button className="premium-button px-6" type="button" onClick={inTransit} disabled={move.isPending}>
                                    Mark it as having travelled
                                </button>
                                <p className="w-full text-xs leading-5 text-ink-soft">
                                    This one still says only that a label was printed. Marking it moved first is what
                                    stops a trade-in being completed for a box on somebody's kitchen table.
                                </p>
                            </>
                        ) : null}

                        {canReceive ? (
                            <button className="premium-button px-6" type="button" onClick={confirmArrival} disabled={move.isPending}>
                                We have it — put it on the bench
                            </button>
                        ) : null}

                        {result.status === 'DeviceReceived' ? (
                            <p className="text-sm text-ink-soft">
                                Already marked as received. Inspect it from the trade-in queue.
                            </p>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {!result && !error ? (
                <AdminEmptyState
                    title="Nothing looked up yet."
                    description="The number is on the shipping label. If the label is unreadable, the IMEI is in Settings → General → About on the device."
                />
            ) : null}
        </section>
    );
};

export default TradeInReceiving;
