import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../utilities/axiosInstance';
import { extractApiError } from '../../../../utilities/formValidation';

const RESTOCKING_FEE_RATE = 0.15;
const money = (value) => `$${Number(value || 0).toFixed(2)}`;

// Tax and shipping lines carry no productId — only real devices and
// accessories do. Matches isRefundableLine on the backend exactly, since a
// customer can only be refunded for something they can also uncheck here.
const isRefundableLine = (item) => Boolean(item?.price_data?.product_data?.metadata?.productId);

/**
 * Calculates and records a refund. This never contacts the bank — UpCell has
 * no refund API credentials, so the number this produces still has to be
 * typed into the Business Center by hand, by Raymond or Yasir. Every label
 * here says that plainly rather than implying the money already moved.
 */
const RefundPanel = ({ order, onRefunded }) => {
    const refundableLines = useMemo(
        () => (order.line_items || []).filter(isRefundableLine),
        [order.line_items]
    );

    // Full order is the common case, so every item starts checked; staff
    // uncheck what is not being returned for a partial refund.
    const [selected, setSelected] = useState(
        () => new Set(refundableLines.map((item) => item.price_data.product_data.metadata.productId))
    );
    const [waiveFee, setWaiveFee] = useState(false);
    const [waiveReason, setWaiveReason] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const toggle = (id) => setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });

    const chosen = refundableLines.filter((item) =>
        selected.has(item.price_data.product_data.metadata.productId)
    );

    // A preview only — the server recalculates from the order itself and is
    // what actually gets recorded. Shown so staff see the number before they
    // commit to it, not as a promise it will be exactly this to the cent.
    const itemsTotal = chosen.reduce((sum, item) => sum + (item.price_data.product_data.metadata.totalPaid || 0), 0);
    const restockingFee = waiveFee ? 0 : Math.round(itemsTotal * RESTOCKING_FEE_RATE * 100) / 100;
    const previewAmount = Math.round((itemsTotal - restockingFee) * 100) / 100;

    const canSubmit = chosen.length > 0 && (!waiveFee || waiveReason.trim().length > 0) && !submitting;

    const submit = async () => {
        if (!canSubmit) return;

        if (!window.confirm(
            `Record a refund of ${money(previewAmount)} for this order?\n\n` +
            `This does not refund the customer automatically — you still need to enter ${money(previewAmount)} in the Bank of America Business Center yourself.`
        )) return;

        setSubmitting(true);
        try {
            const res = await axiosInstance.post(`admin-orders/${order._id}/refund`, {
                itemIds: Array.from(selected),
                waiveRestockingFee: waiveFee,
                waiveReason: waiveFee ? waiveReason.trim() : undefined,
                notes: notes.trim() || undefined,
            });
            toast.success(res.data?.message || 'Refund recorded');
            onRefunded?.();
        } catch (error) {
            toast.error(extractApiError(error, 'Could not record the refund'));
        } finally {
            setSubmitting(false);
        }
    };

    // Already refunded: a record, not a form. Refunding twice is not offered.
    if (order.refund?.approvedAt) {
        const r = order.refund;
        return (
            <div className="rounded-[24px] border-2 border-black/[0.08] bg-surface-alt p-5">
                <h4 className="text-lg font-bold text-apple-text">Refund recorded</h4>
                <div className="mt-3 space-y-1.5 text-sm text-ink-soft">
                    <p>Amount: <strong className="text-apple-text">{money(r.amount)}</strong></p>
                    <p>Items total: <strong className="text-apple-text">{money(r.itemsTotal)}</strong></p>
                    <p>Restocking fee: <strong className="text-apple-text">
                        {r.restockingFeeWaived ? 'Waived' : money(r.restockingFee)}
                    </strong></p>
                    {r.restockingFeeWaived && r.waiveReason ? (
                        <p>Waived because: <strong className="text-apple-text">{r.waiveReason}</strong></p>
                    ) : null}
                    {r.notes ? <p>Notes: <strong className="text-apple-text">{r.notes}</strong></p> : null}
                    <p>Approved by: <strong className="text-apple-text">{r.approvedBy}</strong></p>
                    <p>Approved: <strong className="text-apple-text">{new Date(r.approvedAt).toLocaleString()}</strong></p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                    If this has not been entered in the Business Center yet, it still needs to be.
                </p>
            </div>
        );
    }

    if (!order.paid) return null;

    return (
        <div className="rounded-[24px] border-2 border-black/[0.08] bg-surface-alt p-5">
            <h4 className="text-lg font-bold text-apple-text">Process a refund</h4>
            <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                This calculates the amount and records it here. It does not contact the bank —
                you still need to enter the amount in the Business Center yourself.
            </p>

            <div className="mt-4 space-y-2">
                {refundableLines.map((item) => {
                    const pd = item.price_data.product_data;
                    const id = pd.metadata.productId;
                    return (
                        <label key={id} className="flex items-center gap-3 rounded-[16px] bg-white px-3 py-2.5 text-sm">
                            <input
                                type="checkbox"
                                checked={selected.has(id)}
                                onChange={() => toggle(id)}
                                className="h-4 w-4 accent-brand-red"
                            />
                            <span className="flex-1">
                                <span className="font-bold text-apple-text">{pd.name}</span>
                                <span className="ml-2 text-ink-soft">{pd.description}</span>
                            </span>
                            <span className="font-bold text-apple-text">{money(pd.metadata.totalPaid)}</span>
                        </label>
                    );
                })}
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
                <input
                    type="checkbox"
                    checked={waiveFee}
                    onChange={(e) => setWaiveFee(e.target.checked)}
                    className="h-4 w-4 accent-brand-red"
                />
                Waive the 15% restocking fee
            </label>

            {waiveFee ? (
                <input
                    type="text"
                    className="admin-input mt-2 w-full"
                    placeholder="Reason (required) — e.g. confirmed faulty device"
                    value={waiveReason}
                    onChange={(e) => setWaiveReason(e.target.value)}
                />
            ) : null}

            <textarea
                className="admin-textarea mt-3"
                rows={2}
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <div className="mt-4 space-y-1 border-t border-black/[0.06] pt-3 text-sm text-ink-soft">
                <div className="flex justify-between"><span>Items total</span><strong className="text-apple-text">{money(itemsTotal)}</strong></div>
                <div className="flex justify-between">
                    <span>Restocking fee (15%)</span>
                    <strong className="text-apple-text">{waiveFee ? 'Waived' : `−${money(restockingFee)}`}</strong>
                </div>
                {/* Confirmed with the client: shipping is never refunded, so it is
                    named here rather than just left off the list. */}
                <div className="flex justify-between"><span>Shipping</span><strong className="text-apple-text">Not refunded</strong></div>
                <div className="flex justify-between text-base"><strong className="text-apple-text">Refund amount</strong><strong className="text-apple-text">{money(previewAmount)}</strong></div>
            </div>

            {/* Not yet confirmed with the client, unlike the two rules above —
                say so rather than silently deciding either way. */}
            <p className="mt-2 text-xs text-ink-soft">
                Sales tax on the returned item is not included above. Adjust by hand if it should be refunded.
            </p>

            <button
                type="button"
                className="premium-button mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
                onClick={submit}
                disabled={!canSubmit}
            >
                {submitting ? 'Recording…' : `Record refund of ${money(previewAmount)}`}
            </button>
        </div>
    );
};

export default RefundPanel;
