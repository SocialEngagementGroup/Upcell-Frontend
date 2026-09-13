import React from 'react';
import { useReturnsDashboardQuery } from '../../../queries/refundRequests';

// What is waiting on us, and what we have already missed.
//
// Overdue is the number that matters and is why this exists at all: a promise
// nobody is measuring is not a promise. It is separated from "waiting on the
// customer" deliberately — a paused return is someone's job to chase, but it
// is not UpCell running late, and mixing the two makes the figure meaningless.
const CARDS = [
    { key: 'awaitingApproval', label: 'To approve', tab: 'Submitted' },
    { key: 'inTransit', label: 'In the post', tab: 'LabelIssued' },
    { key: 'awaitingInspection', label: 'To inspect', tab: 'DeviceReceived' },
    { key: 'waitingOnCustomer', label: 'On the customer', tab: 'RevisedOffer' },
    { key: 'awaitingSettlement', label: 'To pay', tab: 'Approved' },
];

const ReturnsDashboard = ({ onJumpTo }) => {
    const { data } = useReturnsDashboardQuery();
    if (!data) return null;

    const { queues = {}, overdue = [] } = data;

    return (
        <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {CARDS.map((card) => (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => onJumpTo?.(card.tab)}
                        className="rounded-2xl border border-black/[0.06] bg-white p-4 text-left transition-colors hover:border-black/15"
                    >
                        <p className="text-2xl font-black text-apple-text">{queues[card.key] || 0}</p>
                        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                            {card.label}
                        </p>
                    </button>
                ))}

                {/* Red only when it is not zero. A permanently red tile stops
                    being read within a week. */}
                <div className={`rounded-2xl border p-4 ${
                    queues.overdue > 0
                        ? 'border-brand-red/30 bg-brand-red/5'
                        : 'border-black/[0.06] bg-white'
                }`}>
                    <p className={`text-2xl font-black ${queues.overdue > 0 ? 'text-brand-red' : 'text-apple-text'}`}>
                        {queues.overdue || 0}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                        Overdue
                    </p>
                </div>
            </div>

            {/* Worst first — the one late longest is the one to do now. */}
            {overdue.length > 0 ? (
                <div className="mt-3 rounded-2xl border border-brand-red/20 bg-brand-red/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-red">
                        Past the promise we made
                    </p>
                    <ul className="mt-2 space-y-1">
                        {overdue.slice(0, 5).map((entry) => (
                            <li key={entry._id} className="flex justify-between text-xs text-apple-text">
                                <span className="font-mono">{entry.rmaNumber || entry._id}</span>
                                <span className="text-brand-red">
                                    {entry.hoursLate}h late · {entry.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {overdue.length > 5 ? (
                        <p className="mt-2 text-[11px] text-ink-soft">and {overdue.length - 5} more</p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default ReturnsDashboard;
