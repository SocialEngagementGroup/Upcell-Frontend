import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../../utilities/toastIcons';
import { extractApiError } from '../../../../utilities/formValidation';
import { useRecordShipmentMutation } from '../../../../queries/orders';

// The same list the backend validates against, in the same order. Kept short
// on purpose: "Other" is the escape hatch for a carrier UpCell uses once, and
// it costs the customer their tracking link, so it should not be the easy
// choice.
const CARRIERS = ['FedEx', 'UPS', 'USPS', 'DHL', 'Other'];

/**
 * Marking an order shipped.
 *
 * Staff buy the label by hand in the carrier's own tool and paste the number
 * back here — the manual first phase, the same way returns work today. The
 * server sends the customer "your order is on its way" with a tracking link,
 * once, so this form is the moment that email goes out.
 */
const ShipPanel = ({ order, onShipped }) => {
    const shipped = order.fulfilment?.trackingNumber;

    const [carrier, setCarrier] = useState(order.fulfilment?.carrier || 'FedEx');
    const [trackingNumber, setTrackingNumber] = useState(shipped || '');
    const [labelUrl, setLabelUrl] = useState(order.fulfilment?.labelUrl || '');
    const [open, setOpen] = useState(!shipped);
    const [error, setError] = useState('');

    const record = useRecordShipmentMutation();

    const submit = (event) => {
        event.preventDefault();
        setError('');

        record.mutate(
            {
                id: order._id,
                carrier,
                trackingNumber: trackingNumber.trim(),
                ...(labelUrl.trim() ? { labelUrl: labelUrl.trim() } : {}),
            },
            {
                onSuccess: (result) => {
                    toast.success(
                        result.emailed ? 'Marked shipped — the customer has been emailed' : 'Tracking number updated',
                        { icon: TOAST_ICONS.statusChanged }
                    );
                    setOpen(false);
                    if (onShipped) onShipped(result);
                },
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    if (!order.paid) {
        return (
            <div className="rounded-[24px] border-2 border-black/[0.08] bg-surface-alt p-5">
                <h4 className="text-lg font-bold text-apple-text">Shipping</h4>
                <p className="mt-2 text-sm text-ink-soft">
                    This order has not been paid for yet, so it cannot be marked shipped.
                </p>
            </div>
        );
    }

    if (shipped && !open) {
        return (
            <div className="rounded-[24px] border-2 border-black/[0.08] bg-surface-alt p-5">
                <h4 className="text-lg font-bold text-apple-text">Shipped</h4>
                <p className="mt-2 text-sm text-ink-soft">
                    {order.fulfilment.carrier} · <span className="font-mono">{order.fulfilment.trackingNumber}</span>
                </p>
                {order.shippedAt ? (
                    <p className="mt-1 text-xs text-apple-gray">
                        Marked shipped {new Date(order.shippedAt).toLocaleDateString()}
                        {order.fulfilment.shippedBy ? ` by ${order.fulfilment.shippedBy}` : ''}
                    </p>
                ) : null}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-3 text-xs font-semibold text-apple-text underline underline-offset-2"
                >
                    Correct the tracking number
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="rounded-[24px] border-2 border-black/[0.08] bg-surface-alt p-5">
            <h4 className="text-lg font-bold text-apple-text">{shipped ? 'Correct the tracking number' : 'Ship this order'}</h4>
            <p className="mt-1 text-xs text-ink-soft">
                {shipped
                    // Said plainly, because the obvious worry when editing this
                    // is that the customer gets a second parcel email.
                    ? 'The customer has already been emailed. Correcting the number does not email them again.'
                    : 'Buy the label in the carrier’s own tool, then paste the number here. The customer is emailed a tracking link.'}
            </p>

            <label className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">Carrier</label>
            <select
                value={carrier}
                onChange={(event) => setCarrier(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
            >
                {CARRIERS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {carrier === 'Other' ? (
                <p className="mt-1.5 text-xs text-ink-soft">
                    The customer gets the number but no tracking link — we only have pages for the four above.
                </p>
            ) : null}

            <label className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">Tracking number</label>
            <input
                type="text"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="As the carrier shows it"
                className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white p-2.5 font-mono text-sm outline-none focus:border-apple-text/25"
            />

            <label className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">Label link <span className="font-normal normal-case tracking-normal">(optional)</span></label>
            <input
                type="url"
                value={labelUrl}
                onChange={(event) => setLabelUrl(event.target.value)}
                placeholder="https://…"
                className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
            />

            {error ? <p className="mt-3 text-sm font-semibold text-brand-red">{error}</p> : null}

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={record.isPending || trackingNumber.trim().length < 6}
                    className="premium-button px-5 py-2.5 text-sm disabled:opacity-50"
                >
                    {record.isPending ? 'Saving…' : shipped ? 'Update' : 'Mark shipped'}
                </button>
                {shipped ? (
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-ink-soft underline underline-offset-2"
                    >
                        Cancel
                    </button>
                ) : null}
            </div>
        </form>
    );
};

export default ShipPanel;
