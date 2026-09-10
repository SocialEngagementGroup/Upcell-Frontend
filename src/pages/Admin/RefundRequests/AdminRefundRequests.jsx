import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import {
    useAdminRefundRequestsQuery,
    useUpdateRefundRequestMutation,
} from '../../../queries/refundRequests';
import { ReturnFlags, QueueSummary, money } from './ReturnPanelKit';
import LabelPanel from './LabelPanel';
import InspectionPanel from './InspectionPanel';
import RevisedOfferPanel from './RevisedOfferPanel';
import { SettlementPanel, DispositionPanel } from './SettlementPanel';
import ReturnsDashboard from './ReturnsDashboard';
import { WindowPanel, DisputeHoldPanel } from './WindowAndHoldPanels';

// The queue Yasir works from. Tabs are the workflow itself, in order, so
// "what needs me next" is the same as "which tab has a number in it".
const TABS = [
    { value: 'Submitted', label: 'New' },
    { value: 'ReturnApproved', label: 'Needs a label' },
    { value: 'LabelIssued', label: 'In the post' },
    { value: 'DeviceReceived', label: 'To inspect' },
    { value: 'InInspection', label: 'Inspecting' },
    { value: 'ActionRequired', label: 'Blocked' },
    { value: 'RevisedOffer', label: 'Offer sent' },
    { value: 'Approved', label: 'To pay' },
    { value: 'Refunded', label: 'Paid' },
    { value: 'Rejected', label: 'To send back' },
    { value: 'ReturnShipped', label: 'Sent back' },
    { value: 'Closed', label: 'Closed' },
];

// What each move needs before it can be made. The server enforces these too —
// these fields exist so staff are asked for them rather than refused after
// filling the form in.
// The moves a person makes by hand. Everything with a form of its own — the
// label, the inspection, an offer, the settlement, the disposition — lives in a
// panel below instead, because those need more than a button and a text box.
const REJECT = {
    status: 'Rejected', label: 'Reject', field: 'rejectionReason',
    prompt: 'Why? The customer is told this.', required: true, danger: true,
};

const ACTIONS = {
    Submitted: [
        { status: 'ReturnApproved', label: 'Approve return', field: 'returnInstructions', prompt: 'Return instructions — this text is emailed to the customer', required: true },
        REJECT,
    ],
    // A device can be walked in, so arrival is available from every state a
    // parcel can be in rather than only after a carrier says delivered.
    ReturnApproved: [{ status: 'DeviceReceived', label: 'Device arrived' }, REJECT],
    LabelIssued: [{ status: 'DeviceReceived', label: 'Device arrived' }, REJECT],
    InTransit: [{ status: 'DeviceReceived', label: 'Device arrived' }, REJECT],
    Delivered: [{ status: 'DeviceReceived', label: 'Device arrived' }, REJECT],
    DeviceReceived: [REJECT],
    InInspection: [
        { status: 'Approved', label: 'Approve full refund', field: 'inspectionNotes', prompt: 'What did the device look like?' },
        REJECT,
    ],
    ActionRequired: [REJECT],
    RevisedOffer: [],
    Approved: [],
    Refunded: [{ status: 'Closed', label: 'Close return' }],
    Rejected: [],
    ReturnShipped: [{ status: 'Closed', label: 'Close return' }],
    Closed: [],
};

// Which form belongs under which status. One place, so a status that gains a
// panel does not also need the card edited.
const PANELS = {
    ReturnApproved: (request) => <LabelPanel request={request} />,
    LabelIssued: (request) => <LabelPanel request={request} />,
    DeviceReceived: (request) => <InspectionPanel request={request} />,
    ActionRequired: (request) => <InspectionPanel request={request} />,
    InInspection: (request) => <RevisedOfferPanel request={request} />,
    Approved: (request) => <SettlementPanel request={request} />,
    Refunded: (request) => <DispositionPanel request={request} />,
    Rejected: (request) => <LabelPanel request={request} direction="outbound" />,
};

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
                    <p className="mt-0.5 font-mono text-xs text-apple-gray">
                        {/* The number the customer quotes and writes on the box.
                            First, because it is what a phone call opens with. */}
                        {request.rmaNumber ? `${request.rmaNumber} · ` : ''}
                        Order {String(request.orderId)}
                    </p>
                </div>
                <p className="text-xs text-apple-gray">{new Date(request.createdAt).toLocaleString()}</p>
            </div>

            <QueueSummary queue={request.queue} />
            <ReturnFlags flags={request.queue?.flags} />

            <p className="mt-3 rounded-2xl bg-surface-alt p-3 text-sm leading-6 text-ink-soft">{request.reason}</p>

            {/* When the thirty days were counted from, and the way to move it.
                Shown on every request because it is the first thing anyone
                checks when a return looks late. */}
            <WindowPanel request={request} />

            {/* Where the parcel is, when there is a parcel. */}
            {request.shipping?.inbound?.trackingNumber ? (
                <p className="mt-2 font-mono text-xs text-apple-gray">
                    {request.shipping.inbound.carrier} {request.shipping.inbound.trackingNumber}
                    {request.shipping?.outbound?.trackingNumber
                        ? ` · back: ${request.shipping.outbound.trackingNumber}`
                        : ''}
                </p>
            ) : null}

            {/* What was offered and what is left to answer. */}
            {request.status === 'RevisedOffer' && request.refundBreakdown?.offeredAmount != null ? (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                    Offered {money(request.refundBreakdown.offeredAmount)} — waiting on the customer
                    {request.refundBreakdown.offerExpiresAt
                        ? ` until ${new Date(request.refundBreakdown.offerExpiresAt).toLocaleDateString()}`
                        : ''}
                </p>
            ) : null}

            {request.disposition?.type ? (
                <p className="mt-2 text-xs text-ink-soft">
                    Device routed: {request.disposition.type}
                    {request.disposition.grade ? ` · grade ${request.disposition.grade}` : ''}
                </p>
            ) : null}

            <p className="mt-3 text-xs text-apple-gray">
                {request.itemIds?.length} item{request.itemIds?.length === 1 ? '' : 's'}
                {request.calculatedAmount ? ` · refund ${money(request.calculatedAmount)}` : ''}
                {request.receivedBy ? ` · received by ${request.receivedBy}` : ''}
            </p>

            {request.rejectionReason ? (
                <p className="mt-2 text-xs text-brand-red">Rejected: {request.rejectionReason}</p>
            ) : null}

            {/* Only once there are photos to hold. */}
            <DisputeHoldPanel request={request} />

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

            {PANELS[request.status] ? PANELS[request.status](request) : null}
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
                <h2 className="text-[28px]">Returns</h2>
                <p className="mt-1 text-sm text-ink-soft">
                    A refund is only paid once the device is back and has been checked.
                </p>
            </div>

            {/* Clicking a counter goes to that queue, because the number is
                only useful as a way in. */}
            <ReturnsDashboard onJumpTo={setTab} />

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
