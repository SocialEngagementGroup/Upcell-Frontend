import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import { money } from '../RefundRequests/ReturnPanelKit';
import { useAdminTradeInsQuery, useTradeInStatusMutation } from '../../../queries/tradeIn';
import {
    TradeInLabelPanel,
    TradeInInspectionPanel,
    TradeInOfferPanel,
    TradeInPayoutPanel,
    TradeInUndeliverablePanel,
    TradeInListPanel,
} from './TradeInPanels';

// The trade-in queue: one tab per state, and the panel that state needs.
//
// The shape of AdminRefundRequests.jsx on purpose. A staff member who knows the
// returns queue should be able to work this one without being taught it twice,
// because it is the same journey with the device travelling the other way.

const TABS = [
    { status: 'Quoted', label: 'Quoted' },
    { status: 'LabelIssued', label: 'Label sent' },
    { status: 'InTransit', label: 'In the post' },
    { status: 'Delivered', label: 'Delivered' },
    { status: 'DeviceReceived', label: 'Arrived' },
    { status: 'InInspection', label: 'On the bench' },
    { status: 'ActionRequired', label: 'Blocked' },
    { status: 'RevisedOffer', label: 'Offer sent' },
    { status: 'Approved', label: 'To pay' },
    { status: 'Paid', label: 'Paid' },
    { status: 'Rejected', label: 'Refused' },
    { status: 'ReturnShipped', label: 'Sent back' },
];

const REJECT = {
    status: 'Rejected',
    label: 'Refuse',
    field: 'note',
    prompt: 'Why is this device being refused? The customer is told this.',
    required: true,
};

// The moves offered from each state.
//
// A copy of the labels, not of the rules: the server checks every move against
// constants/tradeInStatus.js and refuses an illegal one with the list of what
// it would accept, which the card then shows. This list only decides what a
// staff member is offered — a stale entry here is a button that explains
// itself, not a broken record.
const ACTIONS = {
    Quoted: [REJECT, { status: 'Cancelled', label: 'Customer cancelled' }],
    // A label existing is not the parcel moving, so somebody has to say it has.
    LabelIssued: [{ status: 'InTransit', label: 'It is on its way' }, REJECT],
    InTransit: [{ status: 'Delivered', label: 'Carrier says delivered' }, { status: 'DeviceReceived', label: 'We have it' }, REJECT],
    Delivered: [{ status: 'DeviceReceived', label: 'We have it' }, REJECT],
    DeviceReceived: [REJECT],
    // Approving from the bench, when the device is as described. Offering less
    // is the panel below rather than a button, because it needs the reasons.
    InInspection: [
        { status: 'Approved', label: 'As described — pay the quote', field: 'note', prompt: 'Anything worth recording?' },
        REJECT,
    ],
    ActionRequired: [REJECT],
    RevisedOffer: [],
    Approved: [],
    Paid: [{ status: 'Closed', label: 'Close' }],
    Rejected: [],
    ReturnShipped: [{ status: 'Closed', label: 'Close' }],
    Expired: [{ status: 'Closed', label: 'Close' }],
    Cancelled: [{ status: 'Closed', label: 'Close' }],
    Closed: [],
};

// Which form belongs under which state. One place, so a state that gains a
// panel does not also need the card edited.
const PANELS = {
    Quoted: (request) => <TradeInLabelPanel request={request} />,
    LabelIssued: (request) => <TradeInLabelPanel request={request} />,
    DeviceReceived: (request) => <TradeInInspectionPanel request={request} />,
    ActionRequired: (request) => <TradeInInspectionPanel request={request} />,
    InInspection: (request) => <TradeInOfferPanel request={request} />,
    Approved: (request) => (
        <>
            <TradeInPayoutPanel request={request} />
            <TradeInListPanel request={request} />
        </>
    ),
    Paid: (request) => <TradeInListPanel request={request} />,
    Rejected: (request) => <TradeInLabelPanel request={request} direction="outbound" />,
    ReturnShipped: (request) => <TradeInUndeliverablePanel request={request} />,
};

const quotedCents = (request) =>
    request.revisedOfferCents ?? request.estimateCents ?? Math.round((request.estimate || 0) * 100);

const RequestCard = ({ request }) => {
    const [field, setField] = useState('');
    const [openAction, setOpenAction] = useState(null);
    const [error, setError] = useState('');
    const [showTimeline, setShowTimeline] = useState(false);

    const move = useTradeInStatusMutation();
    const actions = ACTIONS[request.status] || [];

    const run = (action) => {
        // A move that needs no text is one click; one that does opens the box
        // first rather than sending an empty field to be refused.
        if (action.field && openAction !== action.label) {
            setOpenAction(action.label);
            return;
        }
        if (action.required && !field.trim()) return;

        setError('');
        move.mutate(
            { id: request._id, status: action.status, ...(action.field ? { [action.field]: field.trim() || undefined } : {}) },
            {
                onSuccess: () => {
                    toast.success(`Moved to ${action.status}`, { icon: TOAST_ICONS.statusChanged });
                    setField('');
                    setOpenAction(null);
                },
                // The server's own words. It refuses for reasons this page
                // cannot always predict, and it names what it would accept.
                onError: (failure) => setError(extractApiError(failure)),
            }
        );
    };

    const panel = PANELS[request.status];
    const inbound = request.shipping?.inbound;

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-apple-text">{request.name} · {request.email}</p>
                    <p className="mt-0.5 font-mono text-xs text-apple-gray">{String(request._id)}</p>
                </div>
                <p className="text-xs text-apple-gray">{new Date(request.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr_260px]">
                <div className="space-y-1.5 text-sm text-ink-soft">
                    <p>Device: <strong className="text-apple-text">{request.modelTitle}</strong></p>
                    <p>Storage: <strong className="text-apple-text">{request.storage}</strong></p>
                    <p>Carrier: <strong className="text-apple-text">{request.carrierTitle || 'Unlocked'}</strong></p>
                    <p>
                        {request.revisedOfferCents != null ? 'Offered' : 'Quoted'}:{' '}
                        <strong className="text-apple-text">{money(quotedCents(request) / 100)}</strong>
                    </p>
                </div>

                <div className="space-y-1.5 text-sm text-ink-soft">
                    {inbound?.trackingNumber ? (
                        <p>Tracking: <strong className="text-apple-text">{inbound.carrier} {inbound.trackingNumber}</strong></p>
                    ) : null}
                    {request.inspection?.finalGrade ? (
                        <p>Grade: <strong className="text-apple-text">{request.inspection.finalGrade}</strong></p>
                    ) : null}
                    {request.inspection?.batteryHealth != null ? (
                        <p>Battery: <strong className="text-apple-text">{request.inspection.batteryHealth}%</strong></p>
                    ) : null}
                    {request.inspection?.imei ? (
                        <p>IMEI: <strong className="font-mono text-apple-text">{request.inspection.imei}</strong></p>
                    ) : null}
                    {request.payout?.paidAt ? (
                        <p>
                            Paid: <strong className="text-apple-text">
                                {money((request.payout.amountCents || 0) / 100)} by {request.payout.method?.replace(/_/g, ' ').toLowerCase()}
                            </strong>
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">{request.status}</p>

                    {openAction ? (
                        <textarea
                            className="admin-input min-h-[80px] text-sm"
                            value={field}
                            onChange={(event) => setField(event.target.value)}
                            placeholder={actions.find((action) => action.label === openAction)?.prompt}
                        />
                    ) : null}

                    {actions.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            className={action.status === 'Rejected' ? 'premium-button-secondary w-full justify-center' : 'premium-button w-full justify-center'}
                            disabled={move.isPending}
                            onClick={() => run(action)}
                        >
                            {openAction === action.label ? 'Confirm' : action.label}
                        </button>
                    ))}

                    {!actions.length ? (
                        <p className="text-xs leading-5 text-ink-soft">
                            Nothing to do from here — use the form below.
                        </p>
                    ) : null}

                    <button
                        type="button"
                        className="w-full text-xs font-semibold text-brand-red"
                        onClick={() => setShowTimeline((prev) => !prev)}
                    >
                        {showTimeline ? 'Hide history' : 'Show history'}
                    </button>
                </div>
            </div>

            {error ? (
                <p className="mt-3 rounded-xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red" role="alert">
                    {error}
                </p>
            ) : null}

            {/* Append-only, and the whole point: "the customer says they posted
                it, we say it never arrived" is only answerable from here. */}
            {showTimeline ? (
                <ol className="mt-4 space-y-2 border-t border-black/[0.06] pt-4">
                    {(request.timeline || []).map((entry, index) => (
                        <li key={index} className="text-xs text-ink-soft">
                            <span className="text-apple-gray">{new Date(entry.at).toLocaleString()}</span>
                            {' — '}
                            <strong className="text-apple-text">{entry.event}</strong>
                            {entry.from ? ` (${entry.from} → ${entry.to})` : ''}
                            {entry.actor ? ` · ${entry.actor}` : ''}
                            {entry.meta?.note ? ` · ${entry.meta.note}` : ''}
                        </li>
                    ))}
                    {!(request.timeline || []).length ? (
                        <li className="text-xs text-ink-soft">Nothing recorded yet.</li>
                    ) : null}
                </ol>
            ) : null}

            {panel ? panel(request) : null}
        </div>
    );
};

const TradeInQueue = () => {
    const [status, setStatus] = useState('Quoted');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAdminTradeInsQuery(status, page);

    const items = data?.items || [];
    const pagination = data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

    const stats = [
        { label: 'In this view', value: pagination.totalItems, sub: TABS.find((tab) => tab.status === status)?.label.toLowerCase() },
        { label: 'Showing', value: items.length, sub: 'on this page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'where you are' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="Devices coming in."
                description="The returns queue run backwards: a device travels to us, somebody looks at it, and money goes out. Each tab is one state, and the form under a request is what that state needs."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.status}
                            type="button"
                            className={status === tab.status ? 'premium-button px-4' : 'premium-button-secondary px-4'}
                            onClick={() => { setStatus(tab.status); setPage(1); }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading trade-ins" description="Pulling the queue." />
            ) : items.length ? (
                <div className="space-y-5">
                    {items.map((request) => <RequestCard key={request._id} request={request} />)}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={items.length}
                        itemLabel="trade-ins"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState
                    title="Nothing here."
                    description="No trade-ins in this state. The queue starts at Quoted — a customer gets a price, then posts the device."
                />
            )}
        </section>
    );
};

export default TradeInQueue;
