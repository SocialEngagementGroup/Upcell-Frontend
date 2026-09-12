import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import { Panel, Field, Text, Num, Area, Select, money } from '../RefundRequests/ReturnPanelKit';
import { useInspectionChecklistQuery } from '../../../queries/refundRequests';
import {
    useTradeInLabelMutation,
    useTradeInInspectionMutation,
    useTradeInRevisedOfferMutation,
    useTradeInPayoutMutation,
    useTradeInShipBackMutation,
    useTradeInUndeliverableMutation,
    useListTradedDeviceMutation,
} from '../../../queries/tradeIn';

// The panels that hang off a trade-in in the admin queue.
//
// Built on the returns panel kit rather than a second copy of it. The two
// workflows are mirrors — a device travels, somebody looks at it, money moves —
// and a staff member who knows one screen should recognise the other.

const CARRIERS = ['FedEx', 'UPS', 'USPS', 'DHL', 'Other'];
const PAYOUT_METHODS = [
    { value: 'ZELLE', label: 'Zelle' },
    { value: 'BANK_TRANSFER', label: 'Bank transfer' },
    { value: 'CHECK', label: 'Cheque' },
];
const DEDUCTION_TYPES = ['DAMAGE', 'MISSING_ITEMS', 'RESTOCKING_FEE', 'INBOUND_POSTAGE'];

const useServerError = () => {
    const [error, setError] = useState('');
    const [details, setDetails] = useState([]);

    const onError = (failure) => {
        setError(extractApiError(failure));
        // The server's own list, when it sends one. An inspection refused for
        // four reasons should say four things, not "invalid".
        setDetails(failure?.response?.data?.details || []);
    };

    const clear = () => { setError(''); setDetails([]); };

    return { error, details, onError, clear };
};

// ---------------------------------------------------------------------------

/**
 * The prepaid label, in both directions.
 *
 * The same three fields cover the device coming to UpCell and a refused one
 * going home, so this is one component with a direction rather than two forms
 * that differ by accident.
 */
export const TradeInLabelPanel = ({ request, direction = 'inbound' }) => {
    const outbound = direction === 'outbound';

    const [carrier, setCarrier] = useState('FedEx');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [labelUrl, setLabelUrl] = useState('');
    const [labelCost, setLabelCost] = useState('');
    const { error, details, onError, clear } = useServerError();

    const inbound = useTradeInLabelMutation();
    const shipBack = useTradeInShipBackMutation();
    const mutation = outbound ? shipBack : inbound;

    const submit = () => {
        clear();
        mutation.mutate(
            {
                id: request._id,
                carrier,
                trackingNumber: trackingNumber.trim(),
                // Sent only when filled. An empty string is not a URL, and the
                // server refuses it rather than treating it as absent.
                ...(labelUrl.trim() ? { labelUrl: labelUrl.trim() } : {}),
                ...(labelCost ? { labelCost: Number(labelCost) } : {}),
            },
            {
                onSuccess: () => {
                    toast.success(outbound ? 'Device marked as sent back' : 'Label sent to the customer', {
                        icon: TOAST_ICONS.statusChanged,
                    });
                    setTrackingNumber('');
                    setLabelUrl('');
                    setLabelCost('');
                },
                onError,
            }
        );
    };

    return (
        <Panel
            title={outbound ? 'Send the device back' : 'Prepaid label'}
            hint={outbound
                ? 'UpCell pays this leg. Holding a device while a disappointed customer decides whether to pay $12 for it is not a saving.'
                : 'Buy the label in FedEx Ship Manager, upload it, and put the tracking number here. UpCell pays to get the device in.'}
            onSubmit={submit}
            submitLabel={outbound ? 'Mark as sent back' : 'Save the label'}
            busy={mutation.isPending}
            disabled={!trackingNumber.trim()}
            error={error}
            details={details}
        >
            <Field label="Carrier">
                <Select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
                    {CARRIERS.map((name) => <option key={name} value={name}>{name}</option>)}
                </Select>
            </Field>
            <Field label="Tracking number" hint="As the carrier shows it.">
                <Text value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
            </Field>
            <Field label="Label link" hint="https only — an http link is blocked in most mail clients.">
                <Text value={labelUrl} onChange={(event) => setLabelUrl(event.target.value)} placeholder="https://…" />
            </Field>
            <Field label="What the label cost" hint="So the postage UpCell absorbs can be reported on.">
                <Num value={labelCost} onChange={(event) => setLabelCost(event.target.value)} />
            </Field>
        </Panel>
    );
};

// ---------------------------------------------------------------------------

/**
 * The bench. What the device turned out to be.
 *
 * The checklist comes from the server so the list an inspector answers and the
 * list the validation demands are the same list — two copies drift, and the one
 * that drifts is always the one on screen.
 */
export const TradeInInspectionPanel = ({ request }) => {
    const { data: checklistData } = useInspectionChecklistQuery();
    const { error, details, onError, clear } = useServerError();

    const [answers, setAnswers] = useState({});
    const [battery, setBattery] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [photoUrls, setPhotoUrls] = useState('');
    const [findings, setFindings] = useState('');

    const inspect = useTradeInInspectionMutation();

    // Drops the checks that only mean something for a device UpCell sold —
    // whether it still matches the grade it sold at, above all. The server
    // skips the same ones for a trade-in, and reading its flag rather than
    // naming the key means a check added later is dropped here too without
    // anybody editing this page.
    const items = useMemo(
        () => (checklistData?.items || []).filter((item) => !item.onlyOnReturn && !item.onlyWhenFaultClaimed),
        [checklistData]
    );

    const requiredPhotos = checklistData?.requiredPhotos ?? 5;

    const photos = useMemo(() => photoUrls
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((url, index) => ({ url, publicId: `tradein/${request._id}/${index}` })), [photoUrls, request._id]);

    const submit = () => {
        clear();

        const checklist = items.map((item) => {
            if (item.key === 'battery_health') {
                return { key: item.key, result: 'pass', value: Number(battery) };
            }
            if (item.key === 'cosmetic_grade') {
                return { key: item.key, result: grade === 'FAIL' ? 'fail' : 'pass', grade };
            }
            return { key: item.key, result: answers[item.key] || 'na' };
        });

        inspect.mutate(
            {
                id: request._id,
                checklist,
                photos,
                ...(findings.trim() ? { findings: findings.trim() } : {}),
                ...(imei.trim() ? { imei: imei.trim() } : {}),
                ...(serialNumber.trim() ? { serialNumber: serialNumber.trim() } : {}),
            },
            {
                onSuccess: (result) => {
                    // The suggestion, said out loud. It is a suggestion and not
                    // a decision, and a person has to act on it.
                    toast.success(
                        result?.suggestion?.outcome
                            ? `Recorded. Suggested: ${result.suggestion.outcome.replace(/_/g, ' ').toLowerCase()}.`
                            : 'Inspection recorded',
                        { icon: TOAST_ICONS.statusChanged }
                    );
                },
                onError,
            }
        );
    };

    return (
        <Panel
            title="Inspection"
            hint={`Every answer, ${requiredPhotos} photos, and the number off the device. There is no earlier record of this phone — this is the record.`}
            onSubmit={submit}
            submitLabel="Record the inspection"
            busy={inspect.isPending}
            disabled={!grade || !battery || photos.length < requiredPhotos}
            error={error}
            details={details}
        >
            {items.map((item) => {
                if (item.key === 'battery_health') {
                    return (
                        <Field key={item.key} label={item.label} hint="Recorded because the next buyer needs it. Never a deduction — battery decline is normal wear.">
                            <Num value={battery} onChange={(event) => setBattery(event.target.value)} />
                        </Field>
                    );
                }

                if (item.key === 'cosmetic_grade') {
                    return (
                        <Field key={item.key} label={item.label}>
                            <Select value={grade} onChange={(event) => setGrade(event.target.value)}>
                                <option value="">Choose…</option>
                                {['EXCELLENT', 'GOOD', 'FAIR', 'FAIL'].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </Select>
                        </Field>
                    );
                }

                return (
                    <Field key={item.key} label={item.label}>
                        <Select
                            value={answers[item.key] || ''}
                            onChange={(event) => setAnswers((prev) => ({ ...prev, [item.key]: event.target.value }))}
                        >
                            <option value="">Choose…</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                            <option value="na">Not applicable</option>
                        </Select>
                    </Field>
                );
            })}

            <Field label="IMEI" hint="Fifteen digits. The only thing that will ever tie this phone to the money UpCell paid for it.">
                <Text value={imei} onChange={(event) => setImei(event.target.value)} />
            </Field>
            <Field label="Serial number" hint="For an iPad or a Mac, which has no IMEI.">
                <Text value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} />
            </Field>

            <Field
                label="Photo links"
                hint={`One per line. ${photos.length} of ${requiredPhotos} — front, back, screen powered on, the IMEI, and any damage.`}
            >
                <Area rows={5} value={photoUrls} onChange={(event) => setPhotoUrls(event.target.value)} />
            </Field>

            <Field label="Notes" hint="What you saw, in your words.">
                <Area value={findings} onChange={(event) => setFindings(event.target.value)} />
            </Field>
        </Panel>
    );
};

// ---------------------------------------------------------------------------

/**
 * Offering less than the quote.
 *
 * Every deduction has to name the check it failed on and the photo that shows
 * it. The server refuses one pointing at a check that passed, because a
 * deduction that looks evidenced and is not is worse than one with no evidence
 * at all.
 */
export const TradeInOfferPanel = ({ request }) => {
    const { error, details, onError, clear } = useServerError();
    const [lines, setLines] = useState([{ type: 'DAMAGE', amount: '', reason: '', findingKey: '', photoIds: '' }]);
    const [token, setToken] = useState('');

    const offer = useTradeInRevisedOfferMutation();

    // Only the checks that actually failed. Offering the rest would let
    // somebody build an offer the server is about to refuse.
    const failedChecks = (request.inspection?.checklist || [])
        .filter((entry) => entry.result === 'fail')
        .map((entry) => entry.key);

    const photoIds = (request.inspection?.photos || []).map((photo) => photo.publicId).filter(Boolean);

    const quoted = request.revisedOfferCents ?? request.estimateCents ?? Math.round((request.estimate || 0) * 100);
    const deducted = lines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);

    const update = (index, patch) =>
        setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));

    const submit = () => {
        clear();
        offer.mutate(
            {
                id: request._id,
                deductions: lines.map((line) => ({
                    type: line.type,
                    amount: Number(line.amount),
                    reason: line.reason.trim(),
                    findingKey: line.findingKey || undefined,
                    photoIds: line.photoIds ? [line.photoIds] : [],
                })),
            },
            {
                onSuccess: (result) => {
                    // The plaintext token, shown once. It is not stored
                    // anywhere it can be read back, so this is the only chance
                    // to put it in an email.
                    setToken(result?.offerToken || '');
                    toast.success('Offer recorded. Send the link to the customer.', { icon: TOAST_ICONS.statusChanged });
                },
                onError,
            }
        );
    };

    const incomplete = lines.some((line) =>
        !line.amount || line.reason.trim().length < 5 || !line.findingKey || !line.photoIds
    );

    return (
        <Panel
            title="Revised offer"
            hint={`Quoted ${money(quoted / 100)}. Every deduction names the check it failed on and the photo that shows it.`}
            onSubmit={submit}
            submitLabel={`Offer ${money((quoted - deducted * 100) / 100)}`}
            busy={offer.isPending}
            disabled={incomplete || deducted * 100 > quoted}
            error={error}
            details={details}
        >
            {!failedChecks.length ? (
                <p className="rounded-xl bg-surface-alt px-3 py-2 text-xs leading-5 text-ink-soft">
                    No check failed at inspection, so there is nothing a deduction can point at. If the device is
                    worse than described, record that on the checklist first.
                </p>
            ) : null}

            {lines.map((line, index) => (
                <div key={index} className="rounded-xl bg-surface-alt p-3">
                    <Field label="What for">
                        <Select value={line.type} onChange={(event) => update(index, { type: event.target.value })}>
                            {DEDUCTION_TYPES.map((type) => (
                                <option key={type} value={type}>{type.replace(/_/g, ' ').toLowerCase()}</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="How much" hint="In dollars.">
                        <Num value={line.amount} onChange={(event) => update(index, { amount: event.target.value })} />
                    </Field>
                    <Field label="The check it failed on">
                        <Select value={line.findingKey} onChange={(event) => update(index, { findingKey: event.target.value })}>
                            <option value="">Choose…</option>
                            {failedChecks.map((key) => <option key={key} value={key}>{key}</option>)}
                        </Select>
                    </Field>
                    <Field label="The photo that shows it">
                        <Select value={line.photoIds} onChange={(event) => update(index, { photoIds: event.target.value })}>
                            <option value="">Choose…</option>
                            {photoIds.map((id) => <option key={id} value={id}>{id.split('/').pop()}</option>)}
                        </Select>
                    </Field>
                    <Field label="Why, in words the customer can read" hint="A number with no explanation is what gets disputed.">
                        <Area value={line.reason} onChange={(event) => update(index, { reason: event.target.value })} />
                    </Field>
                </div>
            ))}

            <button
                type="button"
                className="text-xs font-semibold text-brand-red"
                onClick={() => setLines((prev) => [...prev, { type: 'DAMAGE', amount: '', reason: '', findingKey: '', photoIds: '' }])}
            >
                + another deduction
            </button>

            {token ? (
                <div className="rounded-xl bg-surface-alt p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                        The customer's link — shown once
                    </p>
                    <p className="mt-1.5 break-all font-mono text-[11px] text-apple-text">
                        {`${window.location.origin}/trade-in/offer/${request._id}/${token}`}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-4 text-ink-soft">
                        Only the hash is stored, so this cannot be looked up again. Send it now.
                    </p>
                </div>
            ) : null}
        </Panel>
    );
};

// ---------------------------------------------------------------------------

/**
 * Recording that the money went out.
 *
 * Nothing here moves money — it is the record that a person did. The one hard
 * rule is that no full account number goes in any of these boxes: the server
 * refuses nine or more consecutive digits, and says so.
 */
export const TradeInPayoutPanel = ({ request }) => {
    const { error, details, onError, clear } = useServerError();
    const [method, setMethod] = useState('ZELLE');
    const [recipientName, setRecipientName] = useState(request.name || '');
    const [referenceMasked, setReferenceMasked] = useState('');
    const [reference, setReference] = useState('');

    const pay = useTradeInPayoutMutation();

    const owed = request.revisedOfferCents ?? request.estimateCents ?? Math.round((request.estimate || 0) * 100);

    const submit = () => {
        clear();
        pay.mutate(
            {
                id: request._id,
                method,
                recipientName: recipientName.trim(),
                referenceMasked: referenceMasked.trim(),
                ...(reference.trim() ? { reference: reference.trim() } : {}),
            },
            {
                onSuccess: () => toast.success('Payout recorded', { icon: TOAST_ICONS.statusChanged }),
                onError,
            }
        );
    };

    return (
        <Panel
            title={`Pay ${money(owed / 100)}`}
            hint="UpCell does not store account numbers. The last four digits, or the Zelle handle, is all that is kept."
            onSubmit={submit}
            submitLabel="Record the payment"
            busy={pay.isPending}
            disabled={!recipientName.trim() || !referenceMasked.trim()}
            error={error}
            details={details}
        >
            <Field label="How">
                <Select value={method} onChange={(event) => setMethod(event.target.value)}>
                    {PAYOUT_METHODS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </Field>
            <Field label="Who it was paid to">
                <Text value={recipientName} onChange={(event) => setRecipientName(event.target.value)} />
            </Field>
            <Field
                label={method === 'ZELLE' ? 'Zelle handle' : 'Last four digits'}
                hint={method === 'ZELLE'
                    ? 'The email or phone number the customer gave.'
                    : 'Four digits, not the whole number. A full account number will be refused.'}
            >
                <Text value={referenceMasked} onChange={(event) => setReferenceMasked(event.target.value)} />
            </Field>
            <Field label="UpCell's reference" hint="The bank confirmation or cheque number. Ours, not theirs.">
                <Text value={reference} onChange={(event) => setReference(event.target.value)} />
            </Field>
        </Panel>
    );
};

// ---------------------------------------------------------------------------

/**
 * A refused device that came back again.
 *
 * Starts a hold rather than disposing of anything. A customer who moved house
 * or was away should get an email, not a written-off phone.
 */
export const TradeInUndeliverablePanel = ({ request }) => {
    const { error, details, onError, clear } = useServerError();
    const [reason, setReason] = useState('');

    const mark = useTradeInUndeliverableMutation();

    const submit = () => {
        clear();
        mark.mutate(
            { id: request._id, ...(reason.trim() ? { reason: reason.trim() } : {}) },
            {
                onSuccess: () => toast.success('Marked undelivered. The hold has started.', { icon: TOAST_ICONS.statusChanged }),
                onError,
            }
        );
    };

    return (
        <Panel
            title="Came back undelivered"
            hint="Starts a 60-day hold. Nothing is disposed of — that is a decision somebody makes with the record in front of them."
            onSubmit={submit}
            submitLabel="Start the hold"
            busy={mark.isPending}
            error={error}
            details={details}
        >
            <Field label="What the carrier said">
                <Area value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Nobody home, three attempts" />
            </Field>
        </Panel>
    );
};

// ---------------------------------------------------------------------------

/**
 * Putting the device UpCell bought into the catalogue.
 *
 * As a draft: out of stock, with no price. A device that appears in the shop
 * the moment it is accepted is a device offered for sale before anybody decided
 * what it is worth.
 */
export const TradeInListPanel = ({ request }) => {
    const { error, details, onError, clear } = useServerError();
    const list = useListTradedDeviceMutation();

    if (request.listedVariationId) {
        return (
            <div className="mt-3 rounded-2xl border border-black/[0.06] bg-white p-4">
                <h4 className="text-sm font-bold text-apple-text">In the catalogue</h4>
                <p className="mt-1 text-xs leading-5 text-ink-soft">
                    Added as a draft. Set a price and a photo in Add Product to put it on sale.
                </p>
                <p className="mt-2 font-mono text-[11px] text-apple-gray">{String(request.listedVariationId)}</p>
            </div>
        );
    }

    return (
        <Panel
            title="Add to the catalogue"
            hint="Creates a draft — out of stock, no price. The price book that quoted the buy says nothing about the sell."
            onSubmit={() => {
                clear();
                list.mutate({ id: request._id }, {
                    onSuccess: (result) => toast.success(result?.message || 'Added as a draft', { icon: TOAST_ICONS.statusChanged }),
                    onError,
                });
            }}
            submitLabel="Add as a draft"
            busy={list.isPending}
            error={error}
            details={details}
        >
            <p className="text-xs leading-5 text-ink-soft">
                Grade {request.inspection?.finalGrade || '—'}
                {request.inspection?.batteryHealth != null ? `, battery ${request.inspection.batteryHealth}%` : ''}
                {request.inspection?.imei ? `, IMEI ${request.inspection.imei}` : ''}.
            </p>
        </Panel>
    );
};
