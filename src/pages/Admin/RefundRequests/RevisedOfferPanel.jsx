import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import { useOfferRevisedRefundMutation } from '../../../queries/refundRequests';
import { Panel, Field, Text, Num, Select, Area, money } from './ReturnPanelKit';

const TYPES = [
    { value: 'DAMAGE', label: 'Damage' },
    { value: 'MISSING_ITEMS', label: 'Missing items' },
];

const emptyDeduction = () => ({ type: 'DAMAGE', amount: '', reason: '', findingKey: '' });

// Offering less than the full refund.
//
// The dropdown of findings is the point. The server refuses a deduction that
// names a check which passed, so offering only the failed checks means a staff
// member cannot build an offer that will be rejected — and cannot accidentally
// attach a real deduction to the wrong finding.
const RevisedOfferPanel = ({ request }) => {
    const [deductions, setDeductions] = useState([emptyDeduction()]);
    const [findings, setFindings] = useState(request.inspection?.findings || '');
    const [error, setError] = useState('');
    const [details, setDetails] = useState([]);

    const offer = useOfferRevisedRefundMutation();

    // Only the checks that actually failed. Anything else is not evidence.
    const failedChecks = (request.inspection?.checklist || [])
        .filter((entry) => entry.result === 'fail');

    const update = (index, patch) => setDeductions((current) =>
        current.map((deduction, i) => (i === index ? { ...deduction, ...patch } : deduction))
    );

    const total = deductions.reduce((sum, deduction) => sum + (Number(deduction.amount) || 0), 0);
    const complete = deductions.every((deduction) =>
        Number(deduction.amount) > 0 && deduction.reason.trim().length >= 5 && deduction.findingKey
    );

    const submit = () => {
        setError('');
        setDetails([]);

        offer.mutate(
            {
                id: request._id,
                deductions: deductions.map((deduction) => ({
                    type: deduction.type,
                    amount: Number(deduction.amount),
                    reason: deduction.reason.trim(),
                    findingKey: deduction.findingKey,
                })),
                ...(findings.trim() ? { findings: findings.trim() } : {}),
            },
            {
                onSuccess: (data) => {
                    toast.success(`Offer of ${money(data.offeredAmount)} sent — 5 days to answer`, {
                        icon: TOAST_ICONS.statusChanged,
                    });
                    setDeductions([emptyDeduction()]);
                },
                onError: (mutationError) => {
                    setError(extractApiError(mutationError));
                    setDetails(mutationError?.response?.data?.details || []);
                },
            }
        );
    };

    if (!failedChecks.length) {
        return (
            <p className="mt-3 rounded-2xl bg-surface-alt/60 px-4 py-3 text-xs leading-5 text-ink-soft">
                Nothing failed inspection, so there is nothing to deduct for. A refund reduced with
                no finding behind it is what customers dispute — inspect the device first.
            </p>
        );
    }

    return (
        <Panel
            title="Offer a reduced refund"
            hint="Each deduction has to point at a check that failed. The customer sees your reason and can accept or decline in one click."
            onSubmit={submit}
            submitLabel="Send offer to customer"
            busy={offer.isPending}
            disabled={!complete}
            error={error}
            details={details}
        >
            {deductions.map((deduction, index) => (
                <div key={index} className="rounded-xl bg-surface-alt/60 p-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                value={deduction.type}
                                onChange={(event) => update(index, { type: event.target.value })}
                            >
                                {TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-28">
                            <Num
                                value={deduction.amount}
                                onChange={(event) => update(index, { amount: event.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <Select
                        value={deduction.findingKey}
                        onChange={(event) => update(index, { findingKey: event.target.value })}
                    >
                        <option value="">Which finding justifies this?</option>
                        {failedChecks.map((check) => (
                            <option key={check.key} value={check.key}>{check.key}</option>
                        ))}
                    </Select>

                    <Text
                        value={deduction.reason}
                        onChange={(event) => update(index, { reason: event.target.value })}
                        placeholder="Why, in words the customer can read"
                    />

                    {deductions.length > 1 ? (
                        <button
                            type="button"
                            onClick={() => setDeductions((current) => current.filter((_, i) => i !== index))}
                            className="mt-2 text-[11px] font-bold text-brand-red hover:underline"
                        >
                            Remove
                        </button>
                    ) : null}
                </div>
            ))}

            <button
                type="button"
                onClick={() => setDeductions((current) => [...current, emptyDeduction()])}
                className="text-xs font-bold text-apple-text hover:underline"
            >
                + Add another deduction
            </button>

            <Field label="What you found" hint="Opens the email, so the customer knows what this is about.">
                <Area value={findings} onChange={(event) => setFindings(event.target.value)} />
            </Field>

            {/* The running total, so nobody sends an offer they misadded. The
                authoritative figure is still the server's. */}
            <p className="text-xs font-semibold text-ink-soft">
                Deducting {money(total)} in total.
            </p>
        </Panel>
    );
};

export default RevisedOfferPanel;
