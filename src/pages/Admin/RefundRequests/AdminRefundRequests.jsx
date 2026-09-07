import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import {
    useAdminRefundRequestsQuery,
    useUpdateRefundRequestMutation,
} from '../../../queries/refundRequests';

// The queue Yasir works from. Tabs are the workflow itself, in order, so
// "what needs me next" is the same as "which tab has a number in it".
const TABS = [
    { value: 'Submitted', label: 'New' },
    { value: 'ReturnApproved', label: 'Awaiting return' },
    { value: 'DeviceReceived', label: 'To inspect' },
    { value: 'Approved', label: 'To pay at bank' },
    { value: 'Refunded', label: 'Done' },
    { value: 'Rejected', label: 'Rejected' },
];

// What each move needs before it can be made. The server enforces these too —
// these fields exist so staff are asked for them rather than refused after
// filling the form in.
const ACTIONS = {
    Submitted: [
        { status: 'ReturnApproved', label: 'Approve return', field: 'returnInstructions', prompt: 'Return instructions — this text is emailed to the customer', required: true },
        { status: 'Rejected', label: 'Reject', field: 'rejectionReason', prompt: 'Why? The customer is told this.', required: true, danger: true },
    ],
    ReturnApproved: [
        { status: 'DeviceReceived', label: 'Device arrived' },
        { status: 'Rejected', label: 'Reject', field: 'rejectionReason', prompt: 'Why? The customer is told this.', required: true, danger: true },
    ],
    DeviceReceived: [
        { status: 'Approved', label: 'Approve refund', field: 'inspectionNotes', prompt: 'What did the device look like?' },
        { status: 'Rejected', label: 'Reject', field: 'rejectionReason', prompt: 'Why? The customer is told this.', required: true, danger: true },
    ],
    Approved: [
        { status: 'Refunded', label: 'I entered it at the bank', confirm: 'Only tick this once the amount has actually been entered in the Business Center.' },
    ],
    Refunded: [],
    Rejected: [],
};

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const RequestCard = ({ request, onMove, busy }) => {
    const [field, setField] = useState('');
    const [openAction, setOpenAction] = useState(null);
    const actions = ACTIONS[request.status] || [];

    const run = (action) => {
        // A move that needs no text is a single click; one that does opens the
        // box first rather than sending an empty field to be rejected.
        if (action.field && openAction !== action.status) {
            setOpenAction(action.status);
            return;
        }
        if (action.required && !field.trim()) return;
        if (action.confirm && !window.confirm(action.confirm)) return;

        onMove({ id: request._id, status: action.status, [action.field || 'noop']: field.trim() || undefined });
        setField('');
        setOpenAction(null);
    };

    return (
        <div className="premium-card rounded-[24px] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-apple-text">{request.email}</p>
                    <p className="mt-0.5 font-mono text-xs text-apple-gray">Order {String(request.orderId)}</p>
                </div>
                <p className="text-xs text-apple-gray">{new Date(request.createdAt).toLocaleString()}</p>
            </div>

            <p className="mt-3 rounded-2xl bg-surface-alt p-3 text-sm leading-6 text-ink-soft">{request.reason}</p>

            <p className="mt-3 text-xs text-apple-gray">
                {request.itemIds?.length} item{request.itemIds?.length === 1 ? '' : 's'}
                {request.calculatedAmount ? ` · refund ${money(request.calculatedAmount)}` : ''}
                {request.receivedBy ? ` · received by ${request.receivedBy}` : ''}
            </p>

            {request.rejectionReason ? (
                <p className="mt-2 text-xs text-brand-red">Rejected: {request.rejectionReason}</p>
            ) : null}

            {openAction ? (
                <textarea
                    rows={3}
                    autoFocus
                    value={field}
                    onChange={(event) => setField(event.target.value)}
                    placeholder={actions.find((a) => a.status === openAction)?.prompt}
                    className="mt-3 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm outline-none focus:border-apple-text/25"
                />
            ) : null}

            {actions.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {actions.map((action) => (
                        <button
                            key={action.status}
                            type="button"
                            disabled={busy}
                            onClick={() => run(action)}
                            className={
                                action.danger
                                    ? 'rounded-full border border-brand-red px-4 py-2 text-sm font-medium text-brand-red disabled:opacity-50'
                                    : 'premium-button px-4 py-2 text-sm disabled:opacity-50'
                            }
                        >
                            {openAction === action.status ? 'Confirm' : action.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const AdminRefundRequests = () => {
    const [tab, setTab] = useState('Submitted');
    const { data, isLoading } = useAdminRefundRequestsQuery(tab);
    const updateRequest = useUpdateRefundRequestMutation();

    const move = (payload) => updateRequest.mutate(payload, {
        onSuccess: () => toast.success('Request updated', { icon: TOAST_ICONS.statusChanged }),
        onError: (error) => toast.error(extractApiError(error)),
    });

    const requests = data?.items || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-[28px]">Refund requests</h2>
                <p className="mt-1 text-sm text-ink-soft">
                    A refund is only paid once the device is back and has been checked.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {TABS.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setTab(item.value)}
                        className={
                            tab === item.value
                                ? 'rounded-full bg-apple-text px-4 py-2 text-sm font-medium text-apple-bg'
                                : 'rounded-full border border-black/[0.08] px-4 py-2 text-sm text-ink-soft'
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {isLoading ? <p className="text-sm text-ink-soft">Loading…</p> : null}

            {!isLoading && !requests.length ? (
                <div className="premium-card rounded-[24px] p-8 text-center">
                    <p className="text-sm text-ink-soft">Nothing here.</p>
                </div>
            ) : null}

            <div className="space-y-4">
                {requests.map((request) => (
                    <RequestCard
                        key={request._id}
                        request={request}
                        onMove={move}
                        busy={updateRequest.isPending}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminRefundRequests;
