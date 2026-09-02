import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const PAGE_LIMIT = 15;
const defaultPagination = { page: 1, limit: PAGE_LIMIT, totalItems: 0, totalPages: 1 };

// Plain English for each event. The raw names are accurate but mean nothing to
// whoever is looking at this screen at 9am wondering why a customer is angry.
const EVENT_COPY = {
    webhook_received: { label: 'Bank replied', tone: 'info' },
    marked_paid: { label: 'Payment confirmed', tone: 'good' },
    signature_rejected: { label: 'Rejected — bad signature', tone: 'warning' },
    unmatched_confirmation: { label: 'Payment with no matching order', tone: 'critical' },
    amount_mismatch: { label: 'Wrong amount charged', tone: 'critical' },
    duplicate_confirmation: { label: 'Repeat message (ignored)', tone: 'info' },
    config_error: { label: 'Payment not configured', tone: 'critical' },
    refunded: { label: 'Refunded', tone: 'info' },
};

const TONE_CLASS = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    good: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-slate-50 text-slate-600 border-slate-200',
};

const FILTERS = [
    { key: 'problems', label: 'Problems only' },
    { key: 'all', label: 'Everything' },
    { key: 'marked_paid', label: 'Confirmed payments' },
    { key: 'webhook_received', label: 'Bank replies' },
];

const AdminPayments = () => {
    const [events, setEvents] = useState([]);
    const [summary, setSummary] = useState(null);
    const [filter, setFilter] = useState('problems');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [checkReport, setCheckReport] = useState(null);
    const [openRow, setOpenRow] = useState(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { page, limit: PAGE_LIMIT };
            if (filter === 'problems') params.problemsOnly = 'true';
            else if (filter !== 'all') params.type = filter;

            const res = await axiosInstance.get('admin-payment-events', { params });
            setEvents(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load payment activity');
        } finally {
            setIsLoading(false);
        }
    }, [filter, page]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    useEffect(() => {
        axiosInstance.get('admin-payment-summary')
            .then((res) => setSummary(res.data))
            .catch(() => { /* tiles are a nicety; the table below still works */ });
        axiosInstance.get('admin-payment-check')
            .then((res) => setCheckReport(res.data?.neverRun ? null : res.data))
            .catch(() => { });
    }, []);

    const runCheck = async () => {
        setIsChecking(true);
        try {
            const res = await axiosInstance.post('admin-payment-check');
            setCheckReport(res.data);
            const problems = (res.data.critical?.length || 0) + (res.data.warnings?.length || 0);
            if (problems) toast.warn(`Check finished — ${problems} thing${problems === 1 ? '' : 's'} to look at`);
            else toast.success('Check finished — all payment records agree');
            fetchEvents();
        } catch (error) {
            console.log(error);
            toast.error('Could not run the check');
        } finally {
            setIsChecking(false);
        }
    };

    const applyFilter = (key) => {
        setFilter(key);
        setPage(1);
    };

    const stats = summary ? [
        { label: 'Paid', value: summary.orders.paid, sub: 'orders in the last 7 days' },
        { label: 'Taken', value: `$${summary.takings.toFixed(2)}`, sub: 'confirmed in the last 7 days' },
        { label: 'Awaiting payment', value: summary.orders.pending, sub: 'started but not confirmed' },
        { label: 'Needs attention', value: summary.problems, sub: 'problems in the last 7 days' },
    ] : [];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Payments"
                title="Every payment message, in one place."
                description="What the bank told us and what we did about it. Anything marked red means money may be involved — check it today."
            />

            {summary ? <AdminStatsGrid items={stats} /> : null}

            <div className="admin-panel rounded-[30px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-apple-text">Payment check</p>
                        <p className="text-sm text-ink-soft">
                            {checkReport
                                ? `Last run ${new Date(checkReport.checkedAt).toLocaleString()} — ` +
                                  (checkReport.critical?.length
                                      ? `${checkReport.critical.length} needing attention`
                                      : 'nothing wrong')
                                : 'Compares our records against each other to find money that went missing.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={runCheck}
                        disabled={isChecking}
                        className="rounded-full bg-apple-text px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {isChecking ? 'Checking…' : 'Run check now'}
                    </button>
                </div>

                {checkReport?.critical?.length || checkReport?.warnings?.length ? (
                    <ul className="mt-5 space-y-2 border-t border-slate-200 pt-5">
                        {[...(checkReport.critical || []), ...(checkReport.warnings || [])].map((line, index) => (
                            <li key={index} className="text-sm text-red-700">• {line}</li>
                        ))}
                    </ul>
                ) : null}

                {checkReport?.info?.length ? (
                    <ul className="mt-3 space-y-1">
                        {checkReport.info.map((line, index) => (
                            <li key={index} className="text-sm text-ink-soft">• {line}</li>
                        ))}
                    </ul>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => applyFilter(item.key)}
                        className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                            filter === item.key
                                ? 'border-apple-text bg-apple-text text-white'
                                : 'border-slate-300 text-ink-soft hover:border-apple-text'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading payment activity" description="Pulling the latest messages from the bank." />
            ) : events.length ? (
                <div className="space-y-3">
                    {events.map((event) => {
                        const copy = EVENT_COPY[event.eventType] || { label: event.eventType, tone: 'info' };
                        const isOpen = openRow === event._id;

                        return (
                            <div key={event._id} className="admin-panel rounded-[24px] p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${TONE_CLASS[copy.tone]}`}>
                                            {copy.label}
                                        </span>
                                        <p className="mt-2 text-sm text-ink-soft">
                                            {new Date(event.createdAt).toLocaleString()}
                                            {event.gatewayReference ? ` · Transaction ${event.gatewayReference}` : ''}
                                        </p>
                                        {event.metadata?.reference_number || event.orderId ? (
                                            <p className="text-sm text-ink-soft">
                                                Order: <strong className="text-apple-text">{event.orderId || event.metadata.reference_number}</strong>
                                            </p>
                                        ) : null}
                                        {event.metadata?.invalid_fields?.length ? (
                                            <p className="mt-1 text-sm text-red-700">
                                                Bank rejected: <strong>{event.metadata.invalid_fields.join(', ')}</strong>
                                            </p>
                                        ) : null}
                                        {event.metadata?.expected !== undefined ? (
                                            <p className="mt-1 text-sm text-red-700">
                                                Expected ${Number(event.metadata.expected).toFixed(2)}, bank charged ${Number(event.metadata.authorised).toFixed(2)}
                                            </p>
                                        ) : null}
                                    </div>

                                    {event.metadata?.payload ? (
                                        <button
                                            type="button"
                                            onClick={() => setOpenRow(isOpen ? null : event._id)}
                                            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-ink-soft transition hover:border-apple-text"
                                        >
                                            {isOpen ? 'Hide details' : 'Show what the bank sent'}
                                        </button>
                                    ) : null}
                                </div>

                                {isOpen && event.metadata?.payload ? (
                                    <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-50 p-4">
                                        <table className="w-full text-left text-xs">
                                            <tbody>
                                                {Object.entries(event.metadata.payload).map(([key, value]) => (
                                                    <tr key={key} className="border-b border-slate-200 last:border-0">
                                                        <td className="py-1.5 pr-4 font-mono text-slate-500">{key}</td>
                                                        <td className="py-1.5 font-mono text-apple-text break-all">{String(value)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}

                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={events.length}
                        itemLabel="payment messages"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState
                    title={filter === 'problems' ? 'No payment problems' : 'Nothing recorded yet'}
                    description={
                        filter === 'problems'
                            ? 'Nothing needs your attention. Switch to "Everything" to see normal activity.'
                            : 'Payment messages from the bank will appear here.'
                    }
                />
            )}
        </section>
    );
};

export default AdminPayments;
