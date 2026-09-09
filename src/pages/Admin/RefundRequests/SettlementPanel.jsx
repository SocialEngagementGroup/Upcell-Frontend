import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import {
    useSettleReturnMutation,
    useRecordDispositionMutation,
    useDispositionsQuery,
} from '../../../queries/refundRequests';
import { uploadProductImage } from '../../../utilities/uploadImage';
import { Panel, Field, Text, Num, Select, Area, money } from './ReturnPanelKit';

const METHODS = [
    { value: 'BANK_TRANSFER', label: 'Bank transfer' },
    { value: 'CASH', label: 'Cash in person' },
    { value: 'ORIGINAL_PAYMENT', label: 'Back to the original card' },
];

// Recording that the customer has been paid.
//
// Nothing here moves money — a person does that at the bank or across a
// counter, and this is the record that they did. What it asks for depends on
// which: a transfer needs the bank reference, cash needs the signed receipt,
// because those are the only two things that can answer "who was paid" later.
export const SettlementPanel = ({ request }) => {
    const agreed = request.refundBreakdown?.finalAmount
        ?? request.refundBreakdown?.offeredAmount
        ?? request.calculatedAmount;

    const [method, setMethod] = useState('BANK_TRANSFER');
    const [amount, setAmount] = useState(agreed != null ? String(agreed) : '');
    const [reference, setReference] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const settle = useSettleReturnMutation();
    const isCash = method === 'CASH';

    const uploadReceipt = async (file) => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const uploaded = await uploadProductImage(file, {
                target: 'return_photo',
                productName: `receipt-${request.rmaNumber || request._id}`,
            });
            setReceiptUrl(uploaded.url);
        } catch (uploadError) {
            setError(uploadError?.message || 'Receipt upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const submit = () => {
        setError('');
        settle.mutate(
            {
                id: request._id,
                method,
                amount: Number(amount),
                ...(reference.trim() ? { reference: reference.trim() } : {}),
                ...(receiptUrl ? { receiptUrl } : {}),
            },
            {
                onSuccess: () => toast.success('Refund recorded', { icon: TOAST_ICONS.statusChanged }),
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    return (
        <Panel
            title="Record the refund"
            hint={agreed != null ? `${money(agreed)} was agreed for this return.` : undefined}
            onSubmit={submit}
            submitLabel="Mark as paid"
            busy={settle.isPending}
            disabled={uploading || !amount || (isCash ? !receiptUrl : !reference.trim())}
            error={error}
        >
            <Field label="How it was paid">
                <Select value={method} onChange={(event) => setMethod(event.target.value)}>
                    {METHODS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </Field>

            <Field label="Amount paid" hint="Less than agreed is allowed and stays visible. More is refused.">
                <Num value={amount} onChange={(event) => setAmount(event.target.value)} />
            </Field>

            {isCash ? (
                <Field
                    label="Signed receipt"
                    hint="No bank record stands behind a handover — this is the only proof of who was paid."
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => uploadReceipt(event.target.files?.[0])}
                        className="mt-1.5 w-full text-xs text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-apple-text file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                    />
                    {receiptUrl ? (
                        <img src={receiptUrl} alt="" className="mt-2 h-20 rounded-lg object-cover" />
                    ) : null}
                </Field>
            ) : (
                <Field
                    label="Bank reference"
                    hint="So this can be matched against a statement if the customer says it never arrived."
                >
                    <Text value={reference} onChange={(event) => setReference(event.target.value)} />
                </Field>
            )}
        </Panel>
    );
};

// Where the device goes once UpCell keeps it. A return cannot close without
// this — otherwise the process ends at the refund and the phone becomes
// something on a shelf that nobody is responsible for.
export const DispositionPanel = ({ request }) => {
    const { data } = useDispositionsQuery();
    const record = useRecordDispositionMutation();

    const [type, setType] = useState('');
    const [grade, setGrade] = useState(request.inspection?.grade || '');
    const [reason, setReason] = useState('');
    const [imei, setImei] = useState(request.device?.imei || '');
    const [error, setError] = useState('');

    const options = data?.dispositions || [];
    const chosen = options.find((option) => option.type === type);
    const needsReason = ['SCRAP', 'RETURN_TO_SUPPLIER'].includes(type);
    const needsGrade = chosen && !chosen.restocks;

    const submit = () => {
        setError('');
        record.mutate(
            {
                id: request._id,
                type,
                ...(grade ? { grade } : {}),
                ...(reason.trim() ? { reason: reason.trim() } : {}),
                ...(imei.trim() ? { imei: imei.trim() } : {}),
            },
            {
                onSuccess: (result) => {
                    toast.success(
                        result.restocked ? 'Recorded — device is back on sale' : 'Recorded',
                        { icon: TOAST_ICONS.statusChanged }
                    );
                    // Surfaced rather than swallowed: a restock that silently
                    // failed leaves a device off sale that everyone believes
                    // is on it.
                    if (result.warning) toast.warning(result.warning);
                },
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    return (
        <Panel
            title="Where did the device go?"
            hint="Required before this return can close."
            onSubmit={submit}
            submitLabel="Record disposition"
            busy={record.isPending}
            disabled={!type || (needsGrade && !grade) || (needsReason && !reason.trim())}
            error={error}
        >
            <Field label="Route" hint={chosen?.description}>
                <Select value={type} onChange={(event) => setType(event.target.value)}>
                    <option value="">Choose…</option>
                    {options.map((option) => (
                        <option key={option.type} value={option.type}>{option.label}</option>
                    ))}
                </Select>
            </Field>

            {needsGrade ? (
                <Field label="Grade" hint="Whoever handles it next needs this, and it cannot be recovered later.">
                    <Select value={grade} onChange={(event) => setGrade(event.target.value)}>
                        <option value="">Choose…</option>
                        {['A', 'B', 'C', 'FAIL'].map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </Select>
                </Field>
            ) : null}

            {needsReason ? (
                <Field
                    label="Reason"
                    hint={type === 'SCRAP'
                        ? 'A device that vanishes without one is indistinguishable from a device that walked.'
                        : 'Which supplier terms is this going back under?'}
                >
                    <Area value={reason} onChange={(event) => setReason(event.target.value)} />
                </Field>
            ) : null}

            <Field label="IMEI" hint="The only thing tying a device on a shelf to the return it came from.">
                <Text value={imei} onChange={(event) => setImei(event.target.value)} />
            </Field>
        </Panel>
    );
};
