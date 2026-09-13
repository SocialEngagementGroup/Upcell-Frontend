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
    const [selected, setSelected] = useState(new Set());
    const [reasonCode, setReasonCode] = useState('');
    const [reason, setReason] = useState('');
    const [touched, setTouched] = useState(false);

    // The reason and the chosen items go to the server, which sends back the
    // window for that reason and what the refund would come to. Both are
    // questions only the server can answer honestly: the window differs by
    // reason, and the estimate has to be worked out the same way the real
    // figure is at approval, or the two drift apart.
    const { data, isLoading } = useRefundableItemsQuery(order?._id, {
        reasonCode,
        itemIds: [...selected],
    });
    const createRequest = useCreateRefundRequestMutation();

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

    // A return and a warranty claim are the same form with different words,
    // different reasons, and a different promise at the end of it. The server
    // decides which; this page only reads it.
    const warranty = data.kind === 'WARRANTY';

    const reasons = data.reasons || [];
    const chosenReason = reasons.find((entry) => entry.code === reasonCode) || null;

    const reasonTooShort = reason.trim().length < MIN_REASON;
    const nothingChosen = selected.size === 0;
    const noReasonChosen = !reasonCode;
    const canSubmit = !nothingChosen && !noReasonChosen && !reasonTooShort && !createRequest.isPending;

    const submit = () => {
        setTouched(true);
        if (!canSubmit) return;

        createRequest.mutate(
            { orderId: order._id, itemIds: [...selected], reasonCode, reason: reason.trim() },
            {
                onSuccess: () => {
                    toast.success('Return request sent — check your email', { icon: TOAST_ICONS.statusChanged });
                    setSelected(new Set());
                    setReasonCode('');
                    setReason('');
                    setTouched(false);
                },
                onError: (error) => toast.error(extractApiError(error)),
            }
        );
    };

    return (
        <div className="rounded-[24px] border border-black/[0.06] bg-surface-alt p-5">
            <h4 className="text-base font-medium text-apple-text">
                {warranty ? 'Make a warranty claim' : 'Return an item'}
            </h4>
            <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                {data.feeNotice}{' '}
                {warranty
                    ? data.warrantyEndsAt
                        ? `Your warranty runs until ${new Date(data.warrantyEndsAt).toLocaleDateString()}.`
                        : ''
                    : `You have until ${new Date(data.closesAt).toLocaleDateString()}.`}
            </p>

            {/* Both dates, once the return window has gone. A customer told
                only that the window closed has no way to know the warranty is
                still running, which is the half that helps them. */}
            {!warranty && data.warrantyEndsAt ? (
                <p className="mt-1 text-xs leading-5 text-ink-soft">
                    After that, your 12-month warranty covers hardware faults until{' '}
                    {new Date(data.warrantyEndsAt).toLocaleDateString()}.
                </p>
            ) : null}

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

            <label htmlFor="refund-reason-code" className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                {warranty ? 'What is wrong with it?' : 'Why are you returning it?'}
            </label>
            <select
                id="refund-reason-code"
                name="reasonCode"
                value={reasonCode}
                onChange={(event) => setReasonCode(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
            >
                <option value="">{warranty ? 'Choose a fault…' : 'Choose a reason…'}</option>
                {reasons.map((entry) => (
                    <option key={entry.code} value={entry.code}>{entry.label}</option>
                ))}
            </select>
            {touched && noReasonChosen ? (
                <p className="mt-1 text-xs font-medium text-brand-red">Please tell us why you are returning it.</p>
            ) : null}

            {/* What the return costs the customer: nothing. Said plainly and
                unconditionally, because the whole value of the policy is that
                it does not depend on picking the right reason. It used to vary
                by reason, and a change of mind cost postage and 15%. */}
            {chosenReason ? (
                <div className="mt-3 rounded-2xl bg-white p-4">
                    <p className="text-xs leading-5 text-ink-soft">
                        {warranty
                            ? 'We send you a prepaid label both ways. Once we have looked at it we will repair or replace the device — a refund is only offered where neither is possible.'
                            : `Returns are free — we send you a prepaid label and there is no restocking fee. You have ${chosenReason.windowDays} days from delivery.`}
                    </p>

                    {data.estimate && selected.size > 0 ? (
                        <dl className="mt-3 space-y-1.5 border-t border-black/[0.06] pt-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-ink-soft">Items</dt>
                                <dd className="text-apple-text">${data.estimate.itemsTotal.toFixed(2)}</dd>
                            </div>
                            {data.estimate.taxRefunded > 0 ? (
                                <div className="flex justify-between">
                                    <dt className="text-ink-soft">Sales tax refunded</dt>
                                    <dd className="text-apple-text">${data.estimate.taxRefunded.toFixed(2)}</dd>
                                </div>
                            ) : null}
                            {/* Nothing charges a fee any more. The row survives
                                only so an older request that carries one still
                                renders honestly. */}
                            {data.estimate.restockingFee > 0 ? (
                                <div className="flex justify-between">
                                    <dt className="text-ink-soft">Restocking fee</dt>
                                    <dd className="text-brand-red">−${data.estimate.restockingFee.toFixed(2)}</dd>
                                </div>
                            ) : null}
                            <div className="flex justify-between border-t border-black/[0.06] pt-1.5 font-medium">
                                <dt className="text-apple-text">Estimated refund</dt>
                                <dd className="text-apple-text">${data.estimate.refundAmount.toFixed(2)}</dd>
                            </div>
                        </dl>
                    ) : null}

                    {/* Said plainly. Inspection can change this, and a number
                        presented as final that then drops is the thing that
                        turns a return into a complaint. */}
                    <p className="mt-2 text-[11px] leading-4 text-apple-gray">
                        An estimate. The final amount is confirmed after we inspect the device.
                    </p>
                </div>
            ) : null}

            <label htmlFor="refund-reason" className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                {chosenReason?.requiresNote ? 'Tell us what happened' : 'Anything else we should know?'}
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
