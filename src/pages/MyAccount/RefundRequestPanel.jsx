import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../utilities/toastIcons';
import { extractApiError } from '../../utilities/formValidation';
import { useRefundableItemsQuery, useCreateRefundRequestMutation } from '../../queries/refundRequests';

const MIN_REASON = 10;

// What a customer sees under their own order: either the return form, or the
// reason they cannot use it, or the state of the request they already have.
//
// The panel asks the server whether a return is possible rather than working it
// out here. Delivery date, the 30-day window and whether a request is already
// open are all things the browser can be lied to about, so the answer that
// matters is the one the server gives — this only draws it.
const RefundRequestPanel = ({ order }) => {
    const { data, isLoading } = useRefundableItemsQuery(order?._id);
    const createRequest = useCreateRefundRequestMutation();

    const [selected, setSelected] = useState(new Set());
    const [reason, setReason] = useState('');
    const [touched, setTouched] = useState(false);

    if (isLoading) {
        return (
            <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5 text-sm text-ink-soft">
                Checking whether this order can be returned…
            </div>
        );
    }

    if (!data) return null;

    // Not eligible, or a request is already open. Both are normal answers, not
    // errors — the server sends the sentence to show, so the customer is never
    // left guessing which rule they fell foul of.
    if (!data.ok) {
        return (
            <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
                <h4 className="text-base font-medium text-apple-text">Returns</h4>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{data.message}</p>
                {data.status ? (
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                        Current status: {data.status}
                    </p>
                ) : null}
            </div>
        );
    }

    const toggle = (productId) => setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId); else next.add(productId);
        return next;
    });

    const reasonTooShort = reason.trim().length < MIN_REASON;
    const nothingChosen = selected.size === 0;
    const canSubmit = !nothingChosen && !reasonTooShort && !createRequest.isPending;

    const submit = () => {
        setTouched(true);
        if (!canSubmit) return;

        createRequest.mutate(
            { orderId: order._id, itemIds: [...selected], reason: reason.trim() },
            {
                onSuccess: () => {
                    toast.success('Return request sent — check your email', { icon: TOAST_ICONS.statusChanged });
                    setSelected(new Set());
                    setReason('');
                    setTouched(false);
                },
                onError: (error) => toast.error(extractApiError(error)),
            }
        );
    };

    return (
        <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
            <h4 className="text-base font-medium text-apple-text">Return an item</h4>
            <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                {data.feeNotice} You have until {new Date(data.closesAt).toLocaleDateString()}.
            </p>

            <div className="mt-4 space-y-2">
                {data.items.map((item) => (
                    <label
                        key={item.productId}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 transition-colors hover:bg-white/70"
                    >
                        <input
                            type="checkbox"
                            checked={selected.has(item.productId)}
                            onChange={() => toggle(item.productId)}
                            className="h-4 w-4 accent-brand-red"
                        />
                        {item.image ? (
                            <img src={item.image} alt="" loading="lazy" className="h-10 w-10 rounded-lg object-contain" />
                        ) : null}
                        <span className="flex-1 text-sm text-apple-text">{item.name}</span>
                        <span className="text-sm font-medium text-ink-soft">${Number(item.paid || 0).toFixed(2)}</span>
                    </label>
                ))}
            </div>

            {touched && nothingChosen ? (
                <p className="mt-2 text-xs font-medium text-brand-red">Choose at least one item to return.</p>
            ) : null}

            <label htmlFor="refund-reason" className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                What is wrong with it?
            </label>
            <textarea
                id="refund-reason"
                name="reason"
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Tell us what the problem is, so we know what to look for when it arrives."
                className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
            />
            {touched && reasonTooShort ? (
                <p className="mt-1 text-xs font-medium text-brand-red">
                    Please describe the problem in a little more detail.
                </p>
            ) : null}

            <button
                type="button"
                onClick={submit}
                disabled={createRequest.isPending}
                className="premium-button mt-4 w-full justify-center disabled:opacity-60"
            >
                {createRequest.isPending ? 'Sending…' : 'Request a return'}
            </button>

            {/* Said before they commit, not after. Someone who posts a phone
                before being told where to send it has to be chased for it. */}
            <p className="mt-3 text-xs leading-5 text-ink-soft">
                Please don't send anything back yet — we'll email you the return address once this is approved.
            </p>
        </div>
    );
};

export default RefundRequestPanel;
